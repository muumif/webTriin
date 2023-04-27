import { redirect, type Actions, fail } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";

export const load = async ({ locals, url }) => {
	const user = locals.user;

	return {
		user: {
			username: user.username,
			name: user.name
		}
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
		throw redirect(302, "/");
	}
};
