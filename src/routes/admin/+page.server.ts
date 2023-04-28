import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { Prisma, type AuthUser, Role } from "@prisma/client";
import { LuciaError } from "lucia-auth";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { users } from "./store";

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session, user } = await locals.auth.validateUser();
	if (!session) throw redirect(302, `/?redirectTo=${url.pathname}`);
	if (user.role != "ADMIN") throw redirect(302, `/dashboard`);
	const allUsers = await prisma.authUser.findMany();
	return {
		allUsers
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const username = form.get("username");
		const name = form.get("name");
		const password = form.get("password");
		const role = form.get("role");

		if (
			!username ||
			!password ||
			!name ||
			!role ||
			typeof username != "string" ||
			typeof password != "string" ||
			typeof name != "string" ||
			typeof role != "string"
		)
			return {
				message: "Invalid data",
				messageBackground: "variant-filled-error"
			};
		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: "username",
					providerUserId: username,
					password
				},
				attributes: {
					username,
					name,
					role
				}
			});
			const userToAuth: AuthUser = {
				id: user.userId,
				name: user.name,
				username: user.username,
				role: user.role.toUpperCase() as "ADMIN" | "USER" | "MANAGER"
			};
			users.update((users) => [...users, userToAuth]);
			return {
				message: `User ${user.username} created with role ${user.role} successfully!`,
				messageBackground: "variant-filled-primary"
			};
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002" &&
				error.message?.includes("username")
			) {
				return {
					message: "Username already exists",
					messageBackground: "variant-filled-error"
				};
			}
			if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
				return {
					message: "Username already exists",
					messageBackground: "variant-filled-error"
				};
			}
			console.error(error);
			return {
				message: "Internal server error",
				messageBackground: "variant-filled-error"
			};
		}
	},
	delete: async ({ request }) => {
		const form = await request.formData();
		const username = form.get("username");
		if (!username || typeof username != "string")
			return {
				message: "Invalid data",
				messageBackground: "variant-filled-error"
			};
		try {
			const userQuery = await prisma.authUser.findFirst({
				where: {
					username: username
				}
			});
			if (!userQuery)
				return {
					message: "User not found",
					messageBackground: "variant-filled-error"
				};
			await auth.deleteUser(userQuery.id);
			users.update((users) => users.filter((user) => user.id != userQuery.id));
			return {
				message: `User ${userQuery.username} deleted successfully!`,
				messageBackground: "variant-filled-primary"
			};
		} catch (error) {
			console.error(error);
			return {
				message: "Internal server error",
				messageBackground: "variant-filled-error"
			};
		}
	},
	updatePassword: async ({ request }) => {
		const form = await request.formData();
		const username = form.get("username");
		const password = form.get("password");
		if (!password || !username || typeof password != "string" || typeof username != "string")
			return {
				message: "Invalid data",
				messageBackground: "variant-filled-error"
			};
		try {
			const userQuery = await prisma.authUser.findFirst({
				where: {
					username: username
				}
			});
			if (!userQuery)
				return {
					message: "User not found",
					messageBackground: "variant-filled-error"
				};
			await auth.invalidateAllUserSessions(userQuery.id);
			const user = await auth.updateKeyPassword("username", username, password);
			
			return {
				message: `User ${username} password changed successfully!`,
				messageBackground: "variant-filled-primary"
			};
		} catch (error) {
			console.error(error);
			return {
				message: "Internal server error",
				messageBackground: "variant-filled-error"
			};
		}
	}
};
