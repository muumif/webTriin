<script lang="ts">
      export let data;
</script>


<div class="grid grid-cols-3">
      {#each data.orders as order}
            <div class="card">
                  <header class="card-header">{order.name}<br/>{order.phone}</header>
                  <section class="p-4">
                        {#each order.items as item}
                              <p>{item.name} - {item.price}€</p>
                        {/each}
                        <p>Kokku: {order.items.reduce((acc, item) => acc + item.price, 0)}€</p>
                  </section>
                  <footer class="card-footer">
                        <div class="btn-group variant-filled ">
                                    <button class={order.packed ? "variant-filled-primary" : "variant-filled-primary"}>Pakitud</button>
                              <button class={order.order_card ? "variant-filled-primary" : "variant-filled"}>Pakikaart</button>
                              <button class={order.shipped ? "variant-filled-primary" : "variant-filled"}>Saadetud</button>
                        </div>
                  </footer>
            </div>
      {/each}
</div>