<script>
  // wierd bug:
  // on mobile, tree isnt matched until 3 characters are typed in (intermittent)
  // real issue may be: mobile doesn't preserve the leading whitespace the same...
  // maybe the key input is different?
  // maybe i need to more strictly control the code-flow?
  // maybe i need to check the core query-sanitising aspects of Search.svelte
  // for features/methods etc that aren't supported/working on mobile

  // import flatten from "flat";
  import { onMount } from "svelte";
  import { sTree } from "./store.js";

  // get site tree (pre-parsed)
  import tree from "../public/tree.json";

  onMount(async () => {
    // build DOM grid
    await createGrid(tree);

    // build tree onto DOM grid
    await createTree(tree);
  });

  // build DOM grid from a nested array
  const createGrid = array => {
    const grid = document.querySelector(".tree");

    // calculate numrows: (branches + subbranches) - branches
    const numrows = array.flat(2).length - array.length;

    // loop through rows
    for (let i = 1; i <= numrows; i++) {
      // create row columns
      const a = document.createElement("div");
      const b = document.createElement("div");
      // add border and text resets
      a.className = `c1 r${i} bb-0 bl-0 t-1`;
      // add border resets
      b.className = `c2 r${i} bb-0 bl-0`;
      // add row to grid
      grid.append(a, b);
    }
  };

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
      if (typeof branch[1] === "object") {
        // add parent branch name
        b.textContent = branch[0];

        // set to column 2 for subbranches loop
        // c = 2;

        for (const subbranch of branch[1]) {
          // save subbranch DOM node
          const sb = document.querySelector(`.c2.r${r}`);

          // add ref to subbranch DOM node back into tree.json
          subbranch.push(sb);

          // detect if subbranch display value is text or a link and assign
          sb.innerHTML = detectLink(subbranch);

          // move down to next subbranch
          r++;
        }

        // move one up
        r--;

        // add margin-bump to last subbranch of current branch
        // replace with 'last subbranch' class?
        document.querySelector(`.c2.r${r}`).style.marginBottom = "1rem";

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
    // add DOM-infused tree to store.js
    sTree.set(tree);
  };

  // returns a key-value pair as DOM string
  // called from createTree to check if link or text
  const detectLink = sb => {
    if (sb[1].substring(0, 4) === "http") {
      // set display value to a link href and use the key as the display text
      // conditionalise if a external or local (ie to another page of the same website) link
      // so that target="_blank" only applies to externals? or just remove it?
      return `<a class="t-1" target="_blank" href="${sb[1]}">${sb[0]}</a>`;
    } else {
      // set display value to value
      return `<p class="t-1">${sb[0]}</p>`;
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
  /* moved tree branch styles from here into global.css to
     stop them from getting compiled out as 'unused' */
</style>

<div class="wrap">
  <div class="tree grid-2" />
</div>
