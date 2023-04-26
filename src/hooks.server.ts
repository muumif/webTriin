import { auth } from "$lib/server/lucia";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	if (event.url.pathname.startsWith("/dashboard")) {
		const { session, user } = await event.locals.auth.validateUser();
		if (!session) throw redirect(302, `/?redirectTo=${event.url.pathname}`);
		event.locals.user = user;
	}
	if (event.url.pathname.startsWith("/admin")) {
		const { session, user } = await event.locals.auth.validateUser();
		if (!session) throw redirect(302, `/?redirectTo=${event.url.pathname}`);
		if (user.role != "ADMIN" && session) throw redirect(302, "/");

		console.log(user.role);
		event.locals.user = user;
	}
	return await resolve(event);
};