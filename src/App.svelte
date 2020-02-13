<script>
  // import Omninav from "./Omninav.svelte";
  // , { query }
  import Search from "./Search.svelte";
  import Tree from "./Tree.svelte";

  // intermediate query variable to pass from Search --> Omninav --> Tree
  let queryProp;
</script>

<style>

</style>

<Search query="&nbsp;" bind:query={queryProp} />
<Tree query={queryProp} />
