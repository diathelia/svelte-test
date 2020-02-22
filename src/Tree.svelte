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

  // get site tree (pre-parsed)
  import tree from "../public/tree.json";
  console.log(tree);

  // explicitly make this an empty string so
  // the label function query.length doesn't
  // error out over an undefined query
  export let query = "";

  let branches, subbranches;

  // runs after component is loaded into the DOM - could put like, a lot of code in here
  // 1. functionalise code
  // 2. call sensible functions from within onMount (ie not event listeners or globals etc)
  onMount(async () => {
    // 1. fetch json tree file
    // 2. calculate numRows from json.length and my equation
    // 3. use numRows to generate the empty tree in the DOM
    // 4. run createTree() to add correct content to DOM tree
    createTree(tree);

    // get all non-empty branches
    branches = Array.from(document.querySelectorAll(".c1")).filter(
      b => b.textContent
    );

    // get all non-empty subbranches
    subbranches = Array.from(document.querySelectorAll(".c2")).filter(
      sb => sb.textContent
    );
  });

  // start matching from 1 meaningful char (accounts for whitespace)
  $: if (query.length > 2) {
    // console.log(query);
    // sanitise input for branch matching
    query = query.substring(1).toLowerCase();

    for (const branch of branches) {
      if (branch.textContent.includes(query)) {
        styleBranch(branch, null, 1);
      }
    }

    for (const [i, subbranch] of subbranches.entries()) {
      if (subbranch.textContent.includes(query)) {
        // mutable copy of index to crawl up subbranches
        let ii = i;

        let crawl = false;

        // only run subbranch crawl if not currently on first subbranch
        if (!subbranch.previousElementSibling.textContent) {
          // while the cell to my left is empty, iterate up subbranches
          do {
            // if crawl is false then this is the first do loop iteration
            if (crawl) {
              // add styling to not-first-not-query-target-subbranch
              styleBranch(subbranches[ii], "Left", 0.3);
            } else {
              // add styling to subbranch target
              styleBranch(subbranches[ii], "Left", 1);
            }

            // console.log(ii);
            // iterate up one subbranch
            ii--;

            // set flag to true
            crawl = true;

            // if textContent, the previous sibling is the parent branch
          } while (!subbranches[ii].previousElementSibling.textContent);
        }
        // else {
        //   console.log("skipped while loop --> target sb is first sb");
        // }

        // check if ii is on first subbranch
        // either by while loop iteration or
        // if first subbranch = query target
        if (subbranches[ii].previousElementSibling.textContent) {
          // add styling to first subbranch
          if (crawl) {
            // then first subbranch is not the query target
            styleBranch(subbranches[ii], "Left", 0.3);
          } else {
            // crawl was skipped and first subbranch is query target
            styleBranch(subbranch, "Left", 1);
          }
          // style parent branch
          styleBranch(subbranches[ii].previousElementSibling, "Bottom", 0.3);
        }
      }
    }
  }

  const styleBranch = (branch, edge, opacity) => {
    // construct object from params as JSON
    let styleObj = JSON.parse(
      `{ "opacity": ${opacity}, "border${edge}": "2px solid var(--primary-color)" }`
    );
    // add styles (without overwriting)
    Object.assign(branch.style, styleObj);
  };

  // console.log(treeJSON);
  // debugger;
  // let tree = JSON.parse(treeJSON);
  // console.log(tree);

  // add to videos: tidbits, PAVEMENT_2017_AH18, ...
  // 'source' could be called 'root', 'home' ...
  // placeholder tree object
  // translate into generated object-only JSON string
  // only use lower-case to sync with lowercase-sanitised input
  // keys: display names
  // values: paths to assets
  // let tree = {
  //   home: "path",
  //   about: "path",
  //   web: {
  //     primer_2027: "https://par-ity.github.io/Primer-2027",
  //     platypus: "https://diathelia.github.io/Platypus",
  //     roslyn_health: "https://diathelia.github.io/heal_thy"
  //   },
  //   video: {
  //     oh_ivy: "https://www.youtube.com/watch?v=RJpgCb-XNIU",
  //     procedural_disco: "https://www.youtube.com/watch?v=88DUzNXNxbs",
  //     nctrnl: "https://www.youtube.com/watch?v=6Fxl4-jEOes"
  //   },
  //   loading: {
  //     spinner_1: "~*x+-+x*~",
  //     spinner_2: "|/-|/-|/-|"
  //   }
  // };

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
        // add content
        document.querySelector(`.c${c}.r${r}`).textContent = branch;
        // document.querySelector(`.c${c}.r${r}`).style.borderBottom =
        //   "2px solid var(--primary-color)";
        // set to column 2 for subbranches loop
        c = 2;
        // keep first subbranch on same line
        r--;

        // iterate by key through subbranches
        for (const subbranch in obj[branch]) {
          r++;
          // add border
          // document.querySelector(`.c${c}.r${r}`).style.borderLeft =
          //   "2px solid var(--primary-color)";
          // subbranch value may be text or a link
          let value;

          // detect if value is a link
          if (obj[branch][subbranch].substring(0, 4) === "http") {
            // set value to an <a> tag href and use the key as the display text
            value = `<a target="_blank" href="${obj[branch][subbranch]}">${subbranch}</a>`;
          } else {
            // set value to value
            value = obj[branch][subbranch];
          }

          // console.log("value", obj[branch][subbranch]);
          // console.log("key", subbranch);

          document.querySelector(`.c${c}.r${r}`).innerHTML = value;
        }

        // add margin-bump to last subbranch of current branch
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
    opacity: 0.1;
    border: 2px solid rgba(94, 255, 0, 0);
    transition: all 0.8s ease-in-out;
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

<!-- console.log( subbranches[ii].previousElementSibling.previousElementSibling );
this attempt to stop while looping over aleady visible subbranches just breaks
the loop when it should run... i think it is targeting the wrong elm... &&
subbranch.previousElementSibling.previousElementSibling.style .visibility ===
"hidden" question.. do i want to stop looping over already lit-up -->

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
