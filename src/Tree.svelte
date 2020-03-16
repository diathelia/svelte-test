<script>
  // wierd bug:
  // on mobile, tree isnt matched until 3 characters are typed in (intermittent)
  // real issue may be: mobile doesn't preserve the leading whitespace the same...
  // maybe the key input is different?
  // maybe i need to more strictly control the code-flow?
  // maybe i need to check the core query-sanitising aspects of Search.svelte
  // for features/methods etc that aren't supported/working on mobile

  /*
    styling strategy

    currently styleBranch has a toggle, if "" is
    passed in for param 'edge', it is to indicate
    the styling is for selection or de-selection.
    this is a bad system. when its 'selected' it
    sets the branch to a rbg color, so it is full
    opacity, but actually its opacity is dependent
    upon the parent cells opacity.

    instead, find all cell DOM content that will
    ever be colored and displayed, and set all
    relevant css values to rgba values. next, write
    functionalised code that dials or toggles these
    rgba opacity values up and down as desired.

    make sure to utilise toggle code to halve the
    conditional spaggetti where possible. to do this,
    assume the base css values are all set with rgba,
    then use prefigured class utilities to paint new
    rgba opacity values eg my { 0, 0.1, 0.3, 1 } model

    these classes will need to cover text and borders
    should first and last subbranch classes be used?
    will they help? for border-bottom, this is applied
    to the selected branch. border-left applies to all
    sb's except fsb, and no b's. b's only get b-b if
    b is a pb, so it would benefit from a .pb class.
    but, is this duplication? didn't i code it out alr-
    eady, and these classes would be overkill? or is
    this an oppertunity to re-write that old code using
    css classes? 
    
  */

  // import flatten from "flat";
  import { onMount } from "svelte";

  // get site tree (pre-parsed)
  import tree from "../public/tree.json";

  // explicitly make this an empty string so the label function
  // query.length doesn't error out over an undefined query
  export let query = "";

  // filtered arrays of DOM nodes used for wiping styles
  let branches, subbranches;

  // global for key navigation of tree
  let currentbranch;

  // logs history of branch styles to revert-all later
  // two-dimensional array of [branch, class] arrays
  let log = [];

  onMount(async () => {
    // build DOM grid
    await createGrid(tree);

    // build tree onto DOM grid
    await createTree(tree);
  });

  // called from query listener to dynamically style the tree
  // @param b = branch DOM element
  // @param c = class to add
  const styleBranch = (b, c) => {
    log.push([b, c]);

    let cc = c.slice(0, -1);

    let replace = () => {
      for (const i of b.classList) {
        if (cc === i.slice(0, -1)) {
          b.classList.replace(i, c);
          return true;
        }
      }
      return false;
    };

    if (!replace()) {
      console.log("should this ever happen?");
      b.classList.add(c);
    }
  };

  const removeBranchStyles = () => {
    for (const [b, c] of log) {
      if (c[0] === "b") {
        b.classList.replace(c, `${c.slice(0, -1)}0`);
      } else {
        b.classList.replace(c, `${c.slice(0, -1)}1`);
      }
    }
    log = [];
  };

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
          styleBranch(b[2], "bb-3");
        }
        styleBranch(b[2], "t-3");
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

              // setTimeout(() => {
              styleBranch(b[1][i][2], "bb-3");
              styleBranch(b[1][i][2], "bl-3");
              styleBranch(b[1][i][2].firstChild, "t-3");
              // }, 300);
            } else {
              // query match is first-subbranch
              // setTimeout(() => {
              styleBranch(b[1][i][2], "bb-3");
              styleBranch(b[1][i][2].firstChild, "t-3");
              styleBranch(b[1][i][2].previousElementSibling, "bb-2");
              // }, 300);
            }
            // irregardless styles
            // setTimeout(() => {
            styleBranch(b[1][i][2], "bb-3");
            styleBranch(b[1][i][2].firstChild, "t-3");
            // }, 300);
          } else if (crawl) {
            // then previous loop query matched a non-first-subbranch above sb[i]
            if (i === 0) {
              // style first-subbranch and parent branch
              styleBranch(b[1][i][2].firstChild, "t-2");
              styleBranch(b[1][i][2].previousElementSibling, "bb-2");
              styleBranch(b[1][i][2].previousElementSibling, "t-2");
            } else {
              // style preceding non-first-subbranch
              // setTimeout(() => {
              styleBranch(b[1][i][2], "bl-2");
              styleBranch(b[1][i][2].firstChild, "t-2");
              // }, 50);
            }
          }
        }
      }
    }
    // try design out these style-canceling loops by using class toggles?
    // end of subbranches loop
  } else if (log.length) {
    console.log(log.length);
    removeBranchStyles();
    console.log(log.length);
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
    console.log(tree);
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
      return `<p class="t-1">${sb[1]}</p>`;
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
      // currentbranch = branches[0];
    }
    // theoretically could now use DOM classList to navigate...
    // eventually, will need to turn entire json tree into arrays sigh
    // otherwise dealing with c1 branches is going to be a huge pain
    switch (e.key) {
      case "ArrowLeft":
        console.log(e.key);
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
      const a = document.createElement("div");
      const b = document.createElement("div");
      a.className = `c1 r${i} bb-0 bl-0 t-1`;
      b.className = `c2 r${i} bb-0 bl-0`;
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

<!--
  //   // construct object from params as JSON
  //   let styleObj = JSON.parse(
  //     `{ "opacity": ${opacity}, "border${edge}": "${border}" }`
  //   );
  //   // add styles (without overwriting)
  //   Object.assign(branch.style, styleObj);
  // };

  // test this out (.entries(), flat(), destructuring, ...spread etc)
  // console.log(y.includes([1, 2])); // false
  // console.log(y.includes(y1)); // true
  // console.log(y1 == [1, 2]); // false
  // const paper = log.flat();
  // console.log(JSON.stringify([b, c]) == JSON.stringify(log[0]));
  // if (log.length) {
  //   for (const i of log) {
  //     if (JSON.stringify([b, c]) !== JSON.stringify(i)) {
  //       // console.log("break", log.length);
  //       // return;
  //       continue;
  //     }
  //     console.log("didnt break");
  //     console.log(i);
  //     log.push([b, c]);
  //   }
  // } else {
  //   log.push([b, c]);
  // }
-->
