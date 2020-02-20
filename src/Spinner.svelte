<style>
  .spin-wrap {
    display: grid;
    place-content: center;
    text-align: center;
    overflow: hidden;
    /* font-size: 200%; */
  }

  .spin::after {
    display: inline-block;
    content: "~";
    /* alt times 0.18s */
    animation: spin 0.4s linear infinite alternate;
  }

  @keyframes spin {
    0% {
      /* content: "|"; */
      /* transform: rotate(0); */
    }
    25% {
      /* content: "\\"; */
      content: "*";
      /* transform: skewX(100deg); */
      /* transform: rotate(90deg); */
    }
    50% {
      /* content: "-"; */
      content: "x";
      /* transform: skewX(200deg); */
      /* transform: rotate(180deg); */
    }
    75% {
      /* content: "/"; */
      content: "+";
      /* transform: skewX(100deg); */
      /* transform: rotate(270deg); */
    }
    100% {
      /* content: "|"; */
      content: "-";
      /* transform: skewX(360deg); */
      /* transform: rotate(360deg); */
    }
  }
</style>

<br />
<div class="spin-wrap">
  <div>
    loading . . .
    <span class="spin" />
  </div>
</div>
