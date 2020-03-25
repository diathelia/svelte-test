<script>
  /**** IDEA ****
   * within positionCursor, use a try/catch to try postionCursor code, and if it fails, hard-reset query and queryDOM, to avoid multi-line errors?
   */
  import { onMount } from "svelte";
  import { sQuery } from "./store.js";

  let query;

  // subscribe is one way: update sQuery, and query gets updated
  //                       update query, and sQuery isnt updated
  sQuery.subscribe(value => (query = value));

  onMount(async () => {
    const queryDOM = document.querySelector(".query");
    const swrapDOM = document.querySelector(".search-wrap");

    // use query-focus to trigger search-wrap pink outline
    queryDOM.addEventListener("focus", () => {
      swrapDOM.style.outline = "1px solid var(--secondary-color)";
    });

    // use query-focusout to reset search-wrap to white outline
    queryDOM.addEventListener("focusout", () => {
      swrapDOM.style.outline = "1px solid white";
    });

    // add hover-catchers to all of .omninav to trigger focus too

    // on Search component load, set focus on search bar
    // (svelte complained about the autofocus attribute)
    queryDOM.focus();
  });

  $: if (query && !/^\s/.test(query)) {
    // debugger;
    //MUST ADD MAPPING BACK TO STORE?
    // IS MY ISSUE THAT THIS RUNS, CLEANS local query, leaving store query unsynced?
    console.log("add cod here");
    // $sQuery = ` ${query.substring(1)}`;
    // query = " ";
    // query = $sQuery;
    // positionCursor();
    // console.log(JSON.stringify(query));
  }

  // tries to stop select all bug
  let cntrlDown = false;

  // #cancel mouse-selection of query text
  // const queryMousedown = e => {
  //   e.preventDefault();
  // };

  // catch paste event and strip formatting
  // const queryPaste = e => {
  //   e.preventDefault();
  //   let d = document.createElement("div");
  //   // let text = e.clipboardData.getData("text/plain");
  //   d.textContent = e.clipboardData.getData("text/plain");
  //   document.execCommand("insertText", false, d.textContent);
  // };

  // watch from control key
  const queryKeyup = e => {
    if (e.key === "Control") {
      // toggle global var
      cntrlDown = false;
    }
  };

  // #cancel special keys
  const queryKeydown = e => {
    // console.log(e.key);
    if (e.key === "Control") {
      // toggle global var
      cntrlDown = true;
    }

    if (
      e.key === "Enter" ||
      e.key === "Control" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Delete" ||
      (e.key === "Backspace" && e.target.textContent.length === 1) ||
      (cntrlDown &&
        (e.key === "a" ||
          e.key === "A" ||
          e.key === "Delete" ||
          e.key === "Backspace" ||
          e.key === "v" ||
          e.key === "V"))
    ) {
      e.preventDefault(); // will stop event bubbling --> stops key being pressed
    }
  };

  // from https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/
  // warning: setting 'pointer-events' or 'user-select' to none undermines this function
  const positionCursor = () => {
    // relevant text-element
    // note: needs to be fresh DOM reference
    const tag = document.querySelector(".query");

    if (tag.textContent.length !== 0) {
      // Creates range object
      const setpos = document.createRange();
      // Creates object for selection
      const set = window.getSelection();
      // Set start position of range
      setpos.setStart(tag.childNodes[0], tag.textContent.length);
      // Collapse range within its boundary points
      // Returns boolean
      setpos.collapse(true);
      // Remove all ranges set
      set.removeAllRanges();
      // Add range with respect to range object
      set.addRange(setpos);
      // Set cursor on focus
      tag.focus();
    } else {
      console.log("error, text length =", tag.textContent.length);
      // throw `err: ${tag.textContent.length}`;
    }
  };
</script>

<style>
  .omninav {
    display: grid;
    place-items: center;
    background-color: var(--bg-color);
    text-align: left;
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .search {
    color: var(--primary-color);
    display: inline;
  }

  .search-wrap {
    background-color: rgba(0, 0, 0, 0.69);
    width: 100%;
    /* approx width of .tree (will change with string lengths tho smh) */
    max-width: 28.5rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    outline: 1px solid white;
    cursor: text;
    transition: outline 0.8s ease-in-out;
  }

  .query {
    outline: none;
    caret-color: transparent;
    /* vertical-align: middle; */
  }

  .query::before {
    content: "$_:";
    display: inline;
    color: var(--secondary-color);
    padding-left: 0.15rem;
  }

  .query::after {
    content: "";
    display: inline-block;
    width: 0.8rem;
    height: 1.7rem;
    margin-bottom: 0.15rem;
    margin-left: 0.15rem;
    background-color: var(--primary-color);
    vertical-align: middle;
    animation: blink 1.6s ease-in-out infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 0.4;
    }
    40% {
      opacity: 0;
    }
    60% {
      opacity: 0.4;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
</style>

<div class="omninav" on:click={positionCursor}>
  <div class="search-wrap ow">
    <div class="search" on:click={positionCursor}>
      <span
        class="query"
        contenteditable="true"
        spellcheck="false"
        bind:textContent={$sQuery}
        on:click={positionCursor}
        on:keydown={queryKeydown}
        on:keyup={queryKeyup}
        on:mousedown|preventDefault />
      <!-- on:paste={queryPaste} -->
    </div>
  </div>
</div>

<!--  // trick to join onMount and $:label's powers
  // let mounted = false;
  // runs after component is loaded into the DOM - could put like, a lot of code in here
  // onMount(async () => {
  //   mounted = true;
  // });

  // catch select all, press a key bug that overrides the first whitespace character (needed for clickable width)
  // $: if (query && query.charAt(0) !== " ") {
  //   console.log(`'${query}'`);
  //   query = " " + query;
  //   console.log(`'${query.charAt(0)}'`);
  // }
   -->

<!-- on:keypress={queryKeypress} -->
<!-- on:keypress={console.log('keypress')} -->
<!-- &nbsp; -->

<!--
  // count valid keypresses and restricts length
  // only runs if key is not a special key
  // forces search to remain single-line
  const queryKeypress = e => {
  // 21chars is max at 320px (i5)
  // assume ~25-30% of clientWidth is not .query
  // assume font-size: ~1rem
  // 320 * 0.7 = 224
  // 224 / 21 = ~10px per char
  // use an equation between char size and omnibar width
  let max = Math.floor(
    (document.querySelector(".navbar").clientWidth * 0.666) / 10
  );
  console.log(max);
  if (e.target.textContent.length > max) {
    e.preventDefault();
  }
  };
-->

<!-- 
    // also an option from https://stackoverflow.com/a/7445389
    // function SetEnd(txt) {
      if (txt.createTextRange) {
       //IE
       var FieldRange = txt.createTextRange();
       FieldRange.moveStart('character', txt.value.length);
       FieldRange.collapse();
       FieldRange.select();
       }
      else {
       //Firefox and Opera
       txt.focus();
       var length = txt.value.length;
       txt.setSelectionRange(length, length);
      }
    }
  -->
