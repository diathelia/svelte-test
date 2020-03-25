<script>
  import { sTree, sQuery } from "./store.js";

  let query, tree;

  sQuery.subscribe(value => (query = value));
  sTree.subscribe(value => (tree = value));

  // logs history of branch styles to revert-all later
  // two-dimensional array of [branch, class] arrays
  let log = [];

  // start matching from 1 meaningful char (accounts for whitespace)
  // is there another thing to label-listen for...
  $: if (query.length > 2) {
    // sanitise subscriptionless var to use for branch matching
    let cQuery = query.substring(1).toLowerCase();

    // loop through branches
    for (const b of tree) {
      // if branch includes query, style branch
      if (b[0].includes(cQuery)) {
        if (typeof b[1] === "object") {
          styleBranch(b[2], "bb-3");
        }
        styleBranch(b[2], "t-3");
      }

      // if parent branch
      if (typeof b[1] === "object") {
        // if query matches, set to true = style preceding subbranches
        let crawl = false;

        // reverse-loop through parents subbranches
        for (let i = b[1].length - 1; i >= 0; i--) {
          // if subbranch display text includes query
          if (b[1][i][0].includes(cQuery)) {
            // set flag for subbranch match

            // set query match subbranch to currentbranch
            currentbranch = b[1][i][2];

            if (i !== 0) {
              // set flag to style in-between subbranches
              crawl = true;

              // query-match is a non-first-subbranch
              // setTimeout(() => {
              styleBranch(b[1][i][2], "bb-3");
              styleBranch(b[1][i][2].firstChild, "t-3");
              styleBranch(b[1][i][2], "bl-2");
              // }, 300);
            } else {
              // query match is first-subbranch
              // setTimeout(() => {
              styleBranch(b[1][i][2], "bb-3");
              styleBranch(b[1][i][2].firstChild, "t-3");
              styleBranch(b[1][i][2].previousElementSibling, "bb-2");
              styleBranch(b[1][i][2].previousElementSibling, "t-2");
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
    // end of subbranches loop
  } else if (log.length) {
    resetBranchStyles();
  }

  // dynamically style tree branches (called from query-match label)
  // @param b = branch DOM element
  // @param c = class to add
  const styleBranch = (b, c) => {
    log.push([b, c]);

    let cc = c.slice(0, -1);

    for (const i of b.classList) {
      if (cc === i.slice(0, -1)) {
        b.classList.replace(i, c);
        break;
      }
    }
  };

  const resetBranchStyles = () => {
    // loop through styled branches in log
    for (const [b, c] of log) {
      // get root class name
      let rgb = c.slice(0, -1);

      // if border class
      if (c[0] === "b") {
        // set rgba opacity to 0
        b.classList.replace(c, `${rgb}0`);
      } else {
        // text class, set rgba opacity to 0.1
        b.classList.replace(c, `${rgb}1`);
      }
    }
    // reset log
    log = [];
  };

  // global for key navigation of tree (move to (and rename) Match.svelte?)
  let currentbranch;

  // (assume) on first key detection current = .c1.r1
  // (unless) a query-match has been made
  // (or) multiple query-matches have been made

  // handle tree key navigation
  document.addEventListener("keydown", e => {
    if (!currentbranch) {
      // no current query-match, set current to .c1.r1
      // currentbranch = branches[0];
    }

    // log may still be non-empty...could try log.filter() to remove duplicates
    // and sort somehow, so that keys-nav is only on selected branches...idk
    // maybe letting the user key-nav to any branch is better

    // in any rate, gonna need to use tree as a map, and watch for boundary-errors
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
</script>
