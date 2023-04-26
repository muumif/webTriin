<script>
	import { enhance } from "$app/forms";

</script>



<div class="grid grid-cols-3 gap-1">
	<form
		use:enhance
		method="post"
		class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
	>
		<div class="inline-grid gird-cols-1 gap-1">
                  <span>Create new user</span>
			<div class="p-2">
                        <span>Username</span>
				<input type="text" name="username" class="input" placeholder="Username" required />
			</div>
			<div class="p-2">
                        <span>Name</span>
				<input type="text" name="name" class="input" placeholder="Name" required />
			</div>
                  <div class="p-2">
                        <span>Password</span>
				<input type="password" name="password" class="input" placeholder="Password" required />
			</div>
                  <div class="p-2">
                        <span>Role</span>
                        <select class="select">
                              <option value="ADMIN">ADMIN</option>
                              <option value="USER">USER</option>
                              <option value="MANAGER">MANAGER</option>
                        </select>
                  </div>
                  <button type="submit" class="btn variant-ghost-surface left-1/2 m-2">Create User</button>
		</div>
	</form>
      <form
      use:enhance
      method="post"
      class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
>
      <div class="inline-grid gird-cols-1 gap-1">
            <span>Delete user</span>
            <div class="p-2">
                  <span>Username</span>
                  <input type="text" name="username" class="input" placeholder="Username" required />
            </div>
            <div class="p-2">
                  <span>Name</span>
                  <input type="text" name="name" class="input" placeholder="Name" required />
            </div>
            <div class="p-2">
                  <span>Password</span>
                  <input type="password" name="password" class="input" placeholder="Password" required />
            </div>
            <div class="p-2">
                  <span>Role</span>
                  <select class="select">
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="MANAGER">MANAGER</option>
                  </select>
            </div>
            <button type="submit" class="btn variant-ghost-surface left-1/2 m-2">Create User</button>
      </div>
</form>
<form
use:enhance
method="post"
class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
>
<div class="inline-grid gird-cols-1 gap-1">
      <span>Update user password</span>
      <div class="p-2">
            <span>Username</span>
            <input type="text" name="username" class="input" placeholder="Username" required />
      </div>
      <div class="p-2">
            <span>Name</span>
            <input type="text" name="name" class="input" placeholder="Name" required />
      </div>
      <div class="p-2">
            <span>Password</span>
            <input type="password" name="password" class="input" placeholder="Password" required />
      </div>
      <div class="p-2">
            <span>Role</span>
            <select class="select">
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
            </select>
      </div>
      <button type="submit" class="btn variant-ghost-surface left-1/2 m-2">Create User</button>
</div>
</form>
<form
use:enhance
method="post"
class="border-2 rounded-xl p-6 bg-surface-600/50 shadow-2xl border-primary-500/50"
>
<div class="inline-grid gird-cols-1 gap-1">
      <span>Update user</span>
      <div class="p-2">
            <span>Username</span>
            <input type="text" name="username" class="input" placeholder="Username" required />
      </div>
      <div class="p-2">
            <span>Name</span>
            <input type="text" name="name" class="input" placeholder="Name" required />
      </div>
      <div class="p-2">
            <span>Password</span>
            <input type="password" name="password" class="input" placeholder="Password" required />
      </div>
      <div class="p-2">
            <span>Role</span>
            <select class="select">
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
            </select>
      </div>
      <button type="submit" class="btn variant-ghost-surface left-1/2 m-2">Create User</button>
</div>
</form>
</div>