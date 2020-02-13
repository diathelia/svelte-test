<script>
  /* 
  TO-ADD: a clear search function maybe after selecting a link or clicking
  
  IDEA:
  after every subbranch ends and its time to switch back to col-1, add an extra row
  how does adding an extra row per parent branch? it simplifies our equation:

  (numBranches + numSubbranches) - numParentBranches = numRows
  becomes
  numBranches + numSubbranches = numRows
*/

  // import flatten from "flat";
  import { onMount } from "svelte";

  export let query = "";

  // runs after component is loaded into the DOM - could put like, a lot of code in here
  onMount(async () => {
    createTree(tree);
  });

  // start matching from 1 meaningful char (accounts for whitespace)
  $: if (query.length > 2) {
    // get all non-empty branches
    let branches = document.querySelectorAll(".c1");
    branches = Array.from(branches).filter(b => b.textContent);

    for (const branch of branches) {
      if (branch.textContent.includes(query.substr(1))) {
        branch.style.visibility = "visible";
        branch.style.borderBottom = "2px solid var(--primary-color)";
      }
    }

    // get all non-empty subbranches
    let subbranches = document.querySelectorAll(".c2");
    subbranches = Array.from(subbranches).filter(sb => sb.textContent);

    for (const subbranch of subbranches) {
      if (subbranch.textContent.includes(query.substr(1))) {
        subbranch.style.visibility = "visible";
        subbranch.style.borderLeft = "2px solid var(--primary-color)";
      }
    }
    // if textContent, the previous sibling is the parent branch
    // assume same parent branch for all subbranches that have no textContent prev siblings
    // first c2 with text will also have a parent branch as prev sibling

    // if (subbranches[0].previousElementSibling.textContent) {
    // light up the parent node
    // console.log(
    //   "parent branch:",
    //   subbranches[0].previousElementSibling.textContent
    // );
    // }
  }

  // add to videos: tidbits, PAVEMENT_2017_AH18, ...
  // 'source' could be called 'root', 'home' ...
  // placeholder tree object
  // translate into generated object-only JSON string
  let tree = {
    home: "path",
    about: "path",
    web: {
      primer_2027: "https://par-ity.github.io/Primer-2027",
      platypus: "path",
      roslyn_health: "path"
    },
    video: {
      oh_ivy: "path",
      procedural_disco: "path",
      NCTRNL: "path"
    },
    loading: {
      spinner_1: "~*x+-+x*~*x+-",
      spinner_2: "|/-|/-|/-|"
    }
  };

  // 1. set 'branch' to col-1 once, no newline
  // 2. for subbranch length, add elm to col-2, then newline
  // 3. after last subbranch elm, newline and set back to col-1
  const createTree = obj => {
    // counters for columns and rows
    let c = 1;
    let r = 1;

    for (const branch in obj) {
      // console.log(obj[branch], branch);

      if (typeof obj[branch] == "object") {
        document.querySelector(`.c${c}.r${r}`).textContent = branch;
        r--;

        for (let key in obj[branch]) {
          c = 2;
          r++;
          // console.log(obj[branch][key]);
          // console.log(key);
          document.querySelector(
            `.c${c}.r${r}`
          ).innerHTML = `<a href="${obj[branch][key]}">${key}</a>`;
        }
        // for (let i = 0; i < Object.keys(obj[branch]).length; i++) {
        //   c = 2;
        //   r++;
        //   console.log();

        //   document.querySelector(`.c${c}.r${r}`).textContent = Object.keys(
        //     obj[branch]
        //   )[i];
        // }

        // add margin-bump to last subbranch of a single parent branch here?
        // or try style subbranch boundaries better?
        // or go back to r += 2?

        // reset for new branch
        c = 1;
        r++;
      } else {
        // console.log(obj[branch]);
        document.querySelector(`.c${c}.r${r}`).textContent = branch;
        // reset for new branch
        c = 1;
        r++;
      }
    }
  };
</script>

<style>
  .tree {
    grid-gap: 0;
    grid-template-columns: repeat(2, min-content);
  }

  /* branches */
  .tree div {
    /* visibility: hidden; */
    background-color: var(--bg-color);
    border: 2px solid var(--primary-color);
    padding-left: 0.2rem;
  }
</style>

<div class="wrap">
  <div class="tree grid-2">
    <div class="c1 r1" />
    <div class="c2 r1" />
    <div class="c1 r2" />
    <div class="c2 r2" />
    <div class="c1 r3" />
    <div class="c2 r3" />
    <div class="c1 r4" />
    <div class="c2 r4" />
    <div class="c1 r5" />
    <div class="c2 r5" />
    <div class="c1 r6" />
    <div class="c2 r6" />
    <div class="c1 r7" />
    <div class="c2 r7" />
    <div class="c1 r8" />
    <div class="c2 r8" />
    <div class="c1 r9" />
    <div class="c2 r9" />
    <div class="c1 r10" />
    <div class="c2 r10" />
  </div>
</div>

<!-- html/nav structure options -->
<!-- json, array, object, grid, table, list, mermaidjs ? -->
<!-- could generate these grid items by parameterised calls to a component that makes #each html calls -->

<!-- {#each x as y}{/each} -->

<!--
  // let branches = Object.keys(tree);
  // console.log(branches);

  // for (branch of branches) {
  //   // branch css code here
  //   if (branch.includes(query)) {
  //     // light up brnach
  //   }
  // }

  // from https://stackoverflow.com/a/44134784
  // const getObjRows = obj => {
  //   return Object.keys(tree).reduce(function(r, k) {
  //     return r.concat(k, tree[k]);
  //   }, []);
  // };

  // console.log(
  //   tree.flatMap(a =>
  //     typeof a == "object" ? console.log("col-2") : console.log("col-1")
  //   )
  // );
  // console.log(Object.keys(flatten(tree)));
  // console.log(Object.entries(tree));
  // console.log(flatten(tree).length);

  // const flatTree = flatten(tree);

 // $: if (query) {
  //   console.log(query[0]);
  //   if (query[0] !== " ") {
  //     query = " ";
  //   }
  // } -->
