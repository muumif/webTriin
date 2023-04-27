import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { LuciaError } from "lucia-auth";
import type { RequestEvent } from "./$types";
import { Prisma } from "@prisma/client";

export async function POST({ request }: RequestEvent) {
	const body = await request.json();
	const { username, password, name, secret, role } = body;

	if (secret != process.env.SECRET)
		return new Response(JSON.stringify({ message: "Invalid secret" }), { status: 400 });

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
		return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });

	if (role != "USER" && role != "ADMIN" && role != "MANAGER")
		return new Response(JSON.stringify({ message: "Invalid role" }), { status: 400 });

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

		return new Response(
			JSON.stringify({
				message: `User ${user.username} with role ${user.role} created!`
			}),
			{ status: 200 }
		);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002" &&
			error.message?.includes("username")
		) {
			return new Response(JSON.stringify({ message: "Username already exists" }), {
				status: 400
			});
		}
		if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
			return new Response(JSON.stringify({ message: "Username already exists" }), {
				status: 400
			});
		}
		console.error(error);
		return new Response(JSON.stringify({ message: "Internal server error" }), {
			status: 500
		});
	}
}

export async function DELETE({ request }: RequestEvent) {
	const body = await request.json();
	const { username, secret } = body;

	if (secret != process.env.SECRET)
		return new Response(JSON.stringify({ message: "Invalid secret" }), { status: 400 });

	if (!username || typeof username != "string")
		return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });

	try {
		const userQuery = await prisma.authUser.findFirst({
			where: {
				username: username
			}
		});
		if (!userQuery)
			return new Response(JSON.stringify({ message: "User not found" }), {
				status: 400
			});

		const user = await auth.deleteUser(userQuery.id);
		return new Response(
			JSON.stringify({ message: `User ${userQuery.username} deleted!` }),
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
			return new Response(JSON.stringify({ message: "User not found" }), {
				status: 400
			});
		}
		console.error(error);
		return new Response(JSON.stringify({ message: "Internal server error" }), {
			status: 500
		});
	}
}
