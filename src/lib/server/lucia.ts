import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia-auth/middleware';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => {
		return {
			userId: user.id,
			username: user.username,
			name: user.name,
			role: user.role
		};
	}
});

export type Auth = typeof auth;
