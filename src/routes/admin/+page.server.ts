import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals, url }) => {
      const {session, user} = await locals.auth.validateUser();
      if (!session) throw redirect(302, `/?redirectTo=${url.pathname}`);
      if (user.role != "ADMIN") throw redirect(302, `/dashboard`);
      return {};
};    