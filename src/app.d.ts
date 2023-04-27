import type { PrismaClient } from "@lucia-auth/adapter-prisma/prisma";

declare global {
	namespace App {
		interface Locals {
			auth: import("lucia-auth").AuthRequest;
			user: Lucia.UserAttributes;
		}
	}
	var prisma: PrismaClient;
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type UserAttributes = {
			username: string;
			name: string;
			role: string;
		};
	}
}

export {};
