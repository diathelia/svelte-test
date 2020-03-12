<script>
  // import flatten from "flat";
  import { onMount } from "svelte";

  // add to videos: tidbits, PAVEMENT_2017_AH18, ...
  // only use lower-case to sync with lowercase-sanitised input

  // get site tree (pre-parsed)
  import tree from "../public/tree.json";

  // explicitly make this an empty string so the label function
  // query.length doesn't error out over an undefined query
  export let query = "";

  // filtered arrays of DOM nodes used for wiping styles
  let branches, subbranches;

  // global for key navigation of tree
  let currentbranch;

  // runs after component is loaded into the DOM - could put like, a lot of code in here
  // 1. functionalise code
  // 2. call functions from onMount (but not event listeners or globals etc)
  onMount(async () => {
    // build DOM grid
    await createGrid(tree);

    // build tree onto DOM grid
    await createTree(tree);

    // get all non-empty branches
    branches = Array.from(document.querySelectorAll(".c1")).filter(
      b => b.textContent
    );

    // get all non-empty subbranches (now unneeded due to better mapping)
    subbranches = Array.from(document.querySelectorAll(".c2")).filter(
      sb => sb.textContent
    );
  });

  // start matching from 1 meaningful char (accounts for whitespace)
  // is there another thing to label-listen for...
  $: if (query.length > 2) {
    // sanitise input for branch matching
    query = query.substring(1).toLowerCase();

    // loop through branches
    for (const b of tree) {
      // if branch includes query, style branch
      if (b[0].includes(query)) {
        if (typeof b[1] === "object") {
          styleBranch(b[2], "Bottom", 1);
        } else {
          styleBranch(b[2], "", 1);
        }
      }

      // if parent branch
      if (typeof b[1] === "object") {
        // if query match, set this flag to style preceding subbranches
        let crawl = false;

        // reverse-loop through parents subbranches
        for (let i = b[1].length - 1; i >= 0; i--) {
          // if subbranch display text includes query
          if (b[1][i][0].includes(query)) {
            // set query match subbranch to currentbranch
            currentbranch = b[1][i][2];

            if (i !== 0) {
              // query-match is a non-first-subbranch

              // set flag to style in-between subbranches
              crawl = true;

              setTimeout(() => {
                styleBranch(b[1][i][2], "Left", 1);
              }, 300);
            } else {
              // query match is first-subbranch
              setTimeout(() => {
                styleBranch(b[1][i][2], "Bottom", 1);
                styleBranch(b[1][i][2].previousElementSibling, "Bottom", 0.3);
              }, 300);
            }
            setTimeout(() => {
              styleBranch(b[1][i][2], "Bottom", 1);
            }, 300);
          } else if (crawl) {
            // then previous loop query matched a non-first-subbranch above sb[i]
            if (i === 0) {
              // style first-subbranch and parent branch
              // styleBranch(b[1][i][2], "", 0.3);
              styleBranch(b[1][i][2].previousElementSibling, "Bottom", 0.3);
            } else {
              // style preceding non-first-subbranch
              setTimeout(() => {
                styleBranch(b[1][i][2], "Left", 0.3);
              }, 50);
            }
          }
        }
      }
    }
    // try design out these style-canceling loops by using class toggles?
    // end of subbranches loop
  } else if (branches && subbranches) {
    // query is 0 or 1 characters --> reset all styles
    // [functionalise this code]
    for (const branch of branches) {
      // remove branch opacity highlight and border
      styleBranch(branch, "", 0.1);
      // reset exact matched branch color
      branch.style.color = "#fff";
    }
    for (const subbranch of subbranches) {
      // remove subbranch opacity highlight and border
      styleBranch(subbranch, "", 0.1);
      // reset exact matched subbranch color
      if (subbranch.firstElementChild) {
        subbranch.firstElementChild.style.color = "#fff";
      }
    }
  }

  // build DOM tree from a nested array
  const createTree = array => {
    // counters for columns and rows
    // counter var is unnecessary until sub-sub-branches occur
    // let c = 1;
    let r = 1;

    for (const branch of array) {
      // save branch DOM node
      const b = document.querySelector(`.c1.r${r}`);

      // add ref to branch DOM node back into tree.json
      branch.push(b);

      // detect parent branch
      if (typeof branch[1] == "object") {
        // add parent branch name
        b.textContent = branch[0];

        // set to column 2 for subbranches loop
        // c = 2;

        for (const subbranch of branch[1]) {
          // console.log("key", subbranch[0]);
          // console.log("value", subbranch[1]);

          // save subbranch DOM node
          const sb = document.querySelector(`.c2.r${r}`);

          // add ref to subbranch DOM node back into tree.json
          subbranch.push(sb);

          // console.log(subbranch);

          // detect if subbranch display value is text or a link and assign
          sb.innerHTML = detectLink(subbranch);

          // move down to next subbranch
          r++;
        }

        // move one up
        r--;

        // add margin-bump to last subbranch of current branch
        document.querySelector(`.c2.r${r}`).style.marginBottom = "1rem";

        // experiment: change the width of the text to fit-content?
        // could shrink the borderline to just the width of the text
        // it worked! should this just be generally applied? can copypasta
        // the @supports CSS from heal_thy
        // document.querySelector(`.c2.r${r}`).style.width = "fit-content";
        // reset for new branch
        // c = 1;
        r++;
      } else {
        document.querySelector(`.c1.r${r}`).textContent = branch[0];
        // reset for new branch
        // c = 1;
        r++;
      }
    }
    // r - 1 = total grid rows --> save to global
    // numrows = r - 1;
    console.log(tree);
  };

  // called from query listener to dynamically style the tree
  const styleBranch = (branch, edge, opacity) => {
    let border;
    // if edge is truthy, branch is being selected
    // set border edge value to primary green var
    if (edge) {
      border = "2px solid var(--primary-color)";
    } else {
      // edge is falsy, branch is being de-selected
      // set border value to transparent
      border = "2px solid rgba(94, 255, 0, 0)";
    }

    // construct object from params as JSON
    let styleObj = JSON.parse(
      `{ "opacity": ${opacity}, "border${edge}": "${border}" }`
    );
    // add styles (without overwriting)
    Object.assign(branch.style, styleObj);
  };

  // returns a key-value pair as DOM string
  // called from createTree to check if link or text
  const detectLink = sb => {
    if (sb[1].substring(0, 4) === "http") {
      // set display value to a link href and use the key as the display text
      // conditionalise if a external or local (ie to another page of the same website) link
      // so that target="_blank" only applies to externals? or just remove it?

      // could this be the place to insert the bind:textContents?
      // bind:this={${sb.push(e.target)}}
      return `<a target="_blank" href="${sb[1]}">${sb[0]}</a>`;
    } else {
      // set display value to value
      return `<p>${sb[1]}</p>`;
    }
  };
  // on:mouseover={e.target.style.color='var(--primary-color)!important'}

  // (assume) on first key detection current = .c1.r1
  // (unless) a query-match has been made
  // (or) multiple query-matches have been made

  // handle tree key navigation
  document.addEventListener("keydown", e => {
    if (!currentbranch) {
      // no current query-match, set current to .c1.r1
      currentbranch = branches[0];
    }
    // theoretically could now use DOM classList to navigate...
    // eventually, will need to turn entire json tree into arrays sigh
    // otherwise dealing with c1 branches is going to be a huge pain
    switch (e.key) {
      case "ArrowLeft":
        console.log(e.key);
        styleBranch(currentbranch, "", "1");
        break;
      case "ArrowRight":
        console.log(e.key);
        break;
      case "ArrowUp":
        console.log(e.key);
        break;
      case "ArrowDown":
        console.log(e.key);
        break;
    }
  });

  // build DOM grid from a nested array
  const createGrid = array => {
    const grid = document.querySelector(".tree");
    for (let i = 1; i <= array.flat().length; i++) {
      let a = document.createElement("div");
      let b = document.createElement("div");
      a.className = `c1 r${i}`;
      b.className = `c2 r${i}`;
      grid.append(a, b);
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
  /* moved tree branch styles from here into global.css to avoid getting compiled out */
</style>

<div class="wrap">
  <div class="tree grid-2" />
  <!-- generated by buildTree() -->
</div>

<!-- /*
    are the css styles for tree branches getting compiled out?
    now that the DOM branches are generated, style's arent
    getting applied from the svelte css block...

    how can i time the activation or delivery of these css rules?
    bung em into global.css? good test of compiled out theory

    result: it worked, moving to global returned functionality
  */ -->

<!-- <div class="c1 r1" />
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
    <div class="c2 r10" /> -->

<!-- ------------------------------------------------------------- -->
<!-- CODE I HAD TO map(tree.json <==> DOM grid) THAT WERE 2MESSY:  -->
<!-- ------------------------------------------------------------- -->
<!-- 
    { can now access tree sub-structures (via indexes) and
      sub node position in tree and DOM with one referent }

    // less complex parentbranch list (has no blanks to filter)
    // let parentbranches = document.querySelectorAll(".pb");

      // for (const branch of branches) {
      // if the branch-text includes the query as a whole string, style branch
      // if (branch.textContent.includes(query)) {
      //   styleBranch(branch, "", 1);

        // highlight exact match
        // if (branch.textContent === query) {
        //   branch.style.color = "var(--primary-color)";
        // }
    //   }
    // }

    /*
      1.  detect parent branches
      2.  loop through each set of subbranches
      3.  use breaks/continues/returns (applies to all my loops tbh)
    */
    // highlight exact match
    // if (subbranch.textContent === query) {
    //   subbranch.firstElementChild.style.color = "var(--primary-color)";
    // }

    // if (subbranch.style.marginBottom === "1rem") {
    //   // console.log("last subbranch:", subbranch);
    //   styleBranch(subbranch, "Bottom", 0.3);
    // }

    // add styling to not-first-not-query-target-subbranch
    //   styleBranch(subbranches[ii], "Left", 0.3);
    // } else {
    // add styling to subbranch target
    //   styleBranch(subbranches[ii], "Left", 1);
    // }

    // mutable copy of index to crawl up subbranches
    // let ii = i;
    // let crawl = false;
    // only run subbranch crawl if not currently on first subbranch
    // if (!subbranch.previousElementSibling.textContent) {
    // check if target subbranch = last subbranch
    // (dupe condition in createTree 🤔🤔🤔)

    // while the cell to my left is empty, iterate up subbranches
    // do {
    // if crawl is false then this is the first do loop iteration
    // if (crawl) {
      // test: box off branches? detect last subbranch

    // console.log(ii);
    // iterate up one subbranch
    // ii--;

    // set flag to true
    // crawl = true;

    // if textContent, the previous sibling is the parent branch
    // } while (!subbranches[ii].previousElementSibling.textContent);
    // }
    // else {
    //   console.log("skipped while loop
    target sb is first sb");
    // }

    // check if ii is on first subbranch
    // either by while loop iteration or
    // if first subbranch = query target

    // if (subbranches[ii].previousElementSibling.textContent) {
      
    //   // add styling to first subbranch
    //   if (crawl) {
    //     // then first subbranch is not the query target
    //     styleBranch(subbranches[ii], "Left", 0.3);
    //     // test: box off subbranches?
    //     // styleBranch(subbranches[ii], "Top", 0.3);
    //   } else {
    //     // crawl was skipped and first subbranch is query target
    //     styleBranch(subbranch, "Left", 1);
    //   }
    //   // style parent branch
    //   styleBranch(subbranches[ii].previousElementSibling, "Bottom", 0.3);
    // }
    // }
    // }
-->

<!-- ------------------------------------------------------------- -->
<!-- IDEAS I HAD TO map(tree.json <==> DOM grid) THAT WERE 2MESSY: -->
<!-- ------------------------------------------------------------- -->
<!-- 
  // how to build a mapping from json data to DOM? surely Svelte has a fix
  // what if during createTree I create a bind:value/textContent to a specific
  // variable, per each grid-item?

  /* flow:
      1. load json tree
      2. (calculate size of DOM grid from JSON tree?)
      3. createTree populates DOM tree
      4. each b/sb has a bind:textContent
      5. these bound values are stored in a mapping
      6. that mapping can be used for query-matching
      6. could values be bound directly back to the tree??
  */

  // 1. set 'branch' to col-1 once, no newline
  // 2. for subbranch length, add elm to col-2, then newline
  // 3. after last subbranch elm, newline and set back to col-1

  // createTree is the moment I loop through tree.json:
  // it is therefore the moment to demarcate key nodes
  // such as first and last subbranches, or perhaps
  // simply demarcate the indexes of all subbranches,
  // into the DOM so that query listener can know about
  // this structure.

  // or: change branch styling loops to tree.json based rather
  //     than DOM node based(uses filtered [unordered] arrays)

  // OR: assign a reference to the newly created DOM node to sb[2]?
  // ["primer_2027", "https://par-ity.io, [DOM_REFERENCE]"]

  // console.log(document.querySelector(`.c${c}.r${r}`).className);

-->
<!-- ------------------------------------------------------------- -->
<!-- crazy attempt to handle all possible query-tree matches smh.. -->
<!-- 
  // const branchCombos = [];
  // const subbranchCombos = [];

  // const sbArray = [];

  // for (const branch in tree) {
  //   if (typeof tree[branch] === "object") {
  //     // console.log(branch);
  //     sbArray.push(tree[branch]);
  //   }
  // }
  // console.log(sbArray);
-->
<!-- ------------------------------------------------------------- -->

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
