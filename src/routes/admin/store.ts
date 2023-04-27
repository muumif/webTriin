import type { AuthUser } from "@prisma/client";
import { writable } from "svelte/store";

export const users = writable<AuthUser[]>([]);
