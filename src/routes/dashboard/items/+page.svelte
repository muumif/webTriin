<script lang="ts">
      import { popup, Tab, Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';

      export let data;
      
      let tableSimple: TableSource = {
            head: [],
            body: [],
            foot: []
      };

      if (data?.items) {
            tableSimple = {
                  head: ["Nimi", "Hind", "Kokku", "Müüdud", "Kategooria"],
                  body: tableMapperValues(data.items, ['name', 'price', 'stock', 'sold', 'category']),
                  foot: ["<a class='btn variant-filled' href='/dashboard/create'>Lisa uus</a>"]
            };
      }
</script>

<Table source={tableSimple} />
