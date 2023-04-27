import { redirect, type Actions, fail } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia-auth";
import type { PageServerLoad } from "./$types";
import { showToast } from "$lib/components/toast";

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/dashboard");
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const form = await request.formData();
		const username = form.get("username");
		const password = form.get("password");
		const redirectTo = url.searchParams.get("redirectTo");
		let message: string = "";

		if (
			!username ||
			!password ||
			typeof username !== "string" ||
			typeof password !== "string"
		) {
			return (message = "Kehtetu sisend");
		}

		let success = false;

		try {
			const key = await auth.useKey("username", username, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
			success = true;
		} catch (error) {
			if (
				error instanceof LuciaError &&
				(error.message === "AUTH_INVALID_KEY_ID" ||
					error.message === "AUTH_INVALID_PASSWORD")
			) {
				message = "Vale kasutajanimi või parool";
			} else {
				console.error(error);
				message = "Sisemine serveri viga";
			}
		}

		if (success) {
			if (redirectTo) throw redirect(303, `/${redirectTo.slice(1)}`);
		} else {
			if (message != "") {
				return fail(400, {
					message: message
				});
			}
			return fail(400, {
				message: "Sisemine serveri viga"
			});
		}
	}
};
