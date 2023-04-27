<script lang="ts">
	import { users } from "./store";
	import { enhance } from "$app/forms";
	import Toast from "$lib/components/Toast.svelte";
	import { Table, tableMapperValues, type TableSource } from "@skeletonlabs/skeleton";
	import { onDestroy } from "svelte";

	export let form: { message?: string; messageBackground?: string };
	export let data;

	$users = data.allUsers;
	$: user_data = data.allUsers;

	users.subscribe((_data) => {
		user_data = _data;
	});
	const unsubscribe = users.subscribe((data) => {
		user_data = data;
	});
	onDestroy(unsubscribe);

	$: tableSource = {
		head: ["ID", "Name", "Username", "Role"],
		body: tableMapperValues(user_data, ["id", "name", "username", "role"]),
		foot: [`Total users: ${user_data.length}`]
	};
</script>

{#if form?.message && form?.messageBackground}
	<Toast message={form.message} background={form.messageBackground} />
{/if}

<div class="flex">
	<div class="m-4">
		<form
			use:enhance
			method="post"
			class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/create">
			<div class="inline-grid gird-cols-1 gap-1">
				<span>Create new user</span>
				<div class="p-2">
					<input
						type="text"
						name="username"
						class="input"
						placeholder="Username"
						required />
				</div>
				<div class="p-2">
					<input
						type="text"
						name="name"
						class="input"
						placeholder="Name"
						required />
				</div>
				<div class="p-2">
					<input
						type="password"
						name="password"
						class="input"
						placeholder="Password"
						required />
				</div>
				<div class="p-2">
					<select class="select" name="role">
						<option value="USER">USER</option>
						<option value="MANAGER">MANAGER</option>
						<option value="ADMIN">ADMIN</option>
					</select>
				</div>
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Create User</button>
			</div>
		</form>
	</div>
	<div class="m-4">
		<form
			use:enhance
			method="post"
			class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/updatepassword">
			<div class="inline-grid gird-cols-1 gap-1">
				<span>Update user password</span>
				<div class="p-2">
					<input
						type="text"
						name="userId"
						class="input"
						placeholder="User ID"
						required />
				</div>
				<div class="p-2">
					<input
						type="text"
						name="password"
						class="input"
						placeholder="Password"
						required />
				</div>
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Update</button>
			</div>
		</form>
	</div>
	<div class="m-4">
		<form
			use:enhance
			method="post"
			class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
			action="?/delete">
			<div class="inline-grid gird-cols-1 gap-1">
				<span>Delete user</span>
				<div class="p-2">
					<input
						type="text"
						name="username"
						class="input"
						placeholder="Username"
						required />
				</div>
				<button type="submit" class="btn variant-ghost-surface left-1/2 m-2"
					>Delete</button>
			</div>
		</form>
	</div>
	<div class="m-4 fixed top-0 right-0">
		<Table source={tableSource} />
	</div>
</div>
