<script>
  import { onMount } from "svelte";
  // import { createEventDispatcher } from "svelte";
  // const dispatch = createEventDispatcher();
  // const func = () => dispatch("eventname", var/ref);

  // query is 2-way bound between Search and Tree
  // query is textContent
  export let query;

  // tries to stop select all bug
  let cntrlDown = false;

  // #cancel mouse-selection of query text
  const queryMousedown = e => {
    e.preventDefault();
  };

  // does this make no sense/ functionalise other stuff
  // const toggleCntrl = (e) => e.key === 'Control' : cntrlDown = !cntrlDown

  // watch from control key
  const queryKeyup = e => {
    if (e.key === "Control") {
      // toggle global var
      cntrlDown = false;
    }
  };

  // #cancel special keys
  const queryKeydown = e => {
    console.log(e.key);
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

  // clicking on the body (not any specific elm could call positionCursor?)
  // how do websites set the default mouse/focus place of a website?

  // from https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/
  // warning: setting 'pointer-events' or 'user-select' to none undermines this function
  const positionCursor = () => {
    // relevant text-element
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
      console.log(tag.textContent.length);
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
    background-color: rgba(0, 0, 0, 0.69);
    color: var(--primary-color);
    display: inline;
  }

  .search-wrap {
    width: 100%;
    /* approx width of .tree (will change with string lengths tho smh) */
    max-width: 28.5rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    outline: 1px solid white;
    cursor: text;
  }

  .query {
    outline: none;
    caret-color: transparent;
    /* user-select: none; */
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
    margin-bottom: 0.08rem;
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
        bind:textContent={query}
        on:click={positionCursor}
        on:keydown={queryKeydown}
        on:keyup={queryKeyup}
        on:mousedown={queryMousedown} />
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
