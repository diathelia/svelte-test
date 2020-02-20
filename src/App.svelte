<script>
  // , { query } alternative? theres always dispatch, but im tryna avoid for now just to learn more
  import Search from "./Search.svelte";
  import Tree from "./Tree.svelte";
  import Spinner from "./Spinner.svelte";

  // intermediate query variable to pass from Search --> Omninav --> Tree
  let intermediaryQuery;
</script>

<Search query="&nbsp;" bind:query={intermediaryQuery} />
<Tree query={intermediaryQuery} />
<Spinner />
