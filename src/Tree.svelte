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

  // WWTR i made this query a empty string on init?
  export let query = "";

  // runs after component is loaded into the DOM - could put like, a lot of code in here
  onMount(async () => {
    createTree(tree);
    query = query.toLowerCase();
  });

  // start matching from 1 meaningful char (accounts for whitespace)
  $: if (query.length > 2) {
    // console.log(query);
    // get all non-empty branches
    // let branches = document.querySelectorAll(".c1");
    let branches = Array.from(document.querySelectorAll(".c1")).filter(
      b => b.textContent
    );

    for (const branch of branches) {
      if (branch.textContent.includes(query.substring(1))) {
        branch.style.visibility = "visible";
      }
    }

    // get all non-empty subbranches
    let subbranches = Array.from(document.querySelectorAll(".c2")).filter(
      sb => sb.textContent
    );

    for (const subbranch of subbranches) {
      if (subbranch.textContent.includes(query.substring(1))) {
        subbranch.style.visibility = "visible";
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
      platypus: "https://diathelia.github.io/Platypus",
      roslyn_health: "https://diathelia.github.io/Heal_thy"
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
      // detect a parent branch
      if (typeof obj[branch] == "object") {
        // add margin-bump to top of parent branch?

        // add content
        document.querySelector(`.c${c}.r${r}`).textContent = branch;
        document.querySelector(`.c${c}.r${r}`).style.borderBottom =
          "2px solid var(--primary-color)";
        // set to column 2 for subbranches loop
        c = 2;
        // keep first subbranch on same line
        r--;

        // iterate by key through subbranches
        for (const subbranch in obj[branch]) {
          r++;
          // add border
          document.querySelector(`.c${c}.r${r}`).style.borderLeft =
            "2px solid var(--primary-color)";
          // subbranch value may be text or a link
          let value;

          // detect if value is a link
          if (obj[branch][subbranch].substring(0, 4) === "http") {
            // set value to an <a> tag href and use the key as the display text
            value = `<a href="${obj[branch][subbranch]}">${subbranch}</a>`;
          } else {
            // set value to value
            value = obj[branch][subbranch];
          }

          // console.log("value", obj[branch][subbranch]);
          // console.log("key", subbranch);

          document.querySelector(`.c${c}.r${r}`).innerHTML = value;
        }

        // add margin-bump to last subbranch of a single parent branch
        document.querySelector(`.c2.r${r}`).style.marginBottom = "1rem";

        // reset for new branch
        c = 1;
        r++;
      } else {
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
    background-color: var(--bg-color);
    padding: 0 0.5rem;
  }

  /* branches */
  .tree div {
    padding-left: 0.2rem;
    /* visibility: hidden; */
  }

  .c1 {
    padding-right: 1rem;
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

<!-- // for (let i = 0; i < Object.keys(obj[branch]).length; i++) {
  //   c = 2;
  //   r++;
  //   console.log();

  //   document.querySelector(`.c${c}.r${r}`).textContent = Object.keys(
  //     obj[branch]
  //   )[i];
  // } -->

<!-- html/nav structure options -->
<!-- json, array, object, grid, table, list, mermaidjs ? -->
<!-- could generate these grid items by parameterised calls to a component that makes #each html calls -->

<!-- {#each x as y}{/each} -->

<!--
  // let branches = Object.keys(tree);
  // console.log(branches);

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
  // } -->
