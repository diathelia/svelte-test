<style>
  .spin-wrap {
    padding: 2rem 10rem;
    background-color: blue;
    display: grid;
    place-content: center;
    text-align: center;
    overflow: hidden;
    position: relative;
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
    }
    25% {
      /* content: "\\"; */
      content: "*";
    }
    50% {
      /* content: "-"; */
      content: "x";
    }
    75% {
      /* content: "/"; */
      content: "+";
    }
    100% {
      /* content: "|"; */
      content: "-";
    }
  }

  .spin-2 {
    transform: scale(5);
    /* transform-origin: initial 25px; */
    transform-origin: 50% 25px;
    /* animation-fill-mode: forwards; */
    /* animation: spinn 0.00001s linear infinite; */
    /* animation: spinn 0.015s linear infinite; */
    animation: spinn 4s linear infinite;
  }

  @keyframes spinn {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* .spin-2::after {
    z-index: -1;
    display: inline-block;
    content: "∴";
    color: red;
    transform-origin: 0px 25px;
    animation-fill-mode: forwards;
    animation: spinnn 8s linear infinite;
  }
  @keyframes spinnn {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(315deg);
      color: white;
    }
  } */
</style>

<br />
<div class="spin-wrap">
  <div>
    loading . . .
    <span class="spin" />
  </div>
  <br />
  <p class="spin-2">∴</p>
</div>
