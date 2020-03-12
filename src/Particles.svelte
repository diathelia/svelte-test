<script>
  /*  Particles in p5.js code from https://www.youtube.com/watch?v=H-9jCNhLe-Q
      Modified by using import and a module instance pattern
      Required re-writing Particle class into Object prototype syntax
      Required modifying many 'this.' into 'sketch.' (but not all)
  */
  import p5 from "../public/p5.min";
  import { onMount } from "svelte";

  onMount(async () => {
    const s = sketch => {
      const particles = [];

      let parentWidth;
      let parentHeight;

      sketch.setup = () => {
        // get parent width / height
        parentWidth = document.querySelector("#p5-wrap").offsetWidth;
        parentHeight = document.querySelector("#p5-wrap").offsetHeight;

        let canvas = sketch.createCanvas(parentWidth, parentHeight);

        canvas.parent("p5-wrap");

        const particlesLength = Math.min(Math.floor(parentWidth / 100), 100);
        for (let i = 0; i < particlesLength; i++) {
          // let p = new sketch.Particle();
          // console.log(typeof p);
          particles.push(new sketch.Particle());
        }
        // console.log(particles[0].toString());
      };

      sketch.draw = () => {
        sketch.clear();
        particles.forEach((particle, idx) => {
          particle.update();
          particle.draw();
          particle.checkParticles(particles.slice(idx));
        });
      };

      sketch.Particle = function() {
        this.pos = sketch.createVector(
          sketch.random(sketch.width),
          sketch.random(sketch.height)
        );
        this.vel = sketch.createVector(
          sketch.random(-2, 2),
          sketch.random(-2, 2)
        );
        this.size = 25;

        // console.log(this.toString());
      };

      sketch.Particle.prototype.update = function() {
        this.pos.add(this.vel);
        this.edges();
      };

      sketch.Particle.prototype.draw = function() {
        // console.log(sketch.addClass("bg-blur"));
        sketch.noStroke();
        sketch.fill("rgba(255, 255, 255, 0.5)");
        sketch.circle(this.pos.x, this.pos.y, this.size * 2);
      };

      sketch.Particle.prototype.edges = function() {
        if (this.pos.x < 0 || this.pos.x > sketch.width) {
          this.vel.x *= -1;
        }

        if (this.pos.y < 0 || this.pos.y > sketch.height) {
          this.vel.y *= -1;
        }

        // 		if(this.pos.x > width) {
        // 			this.pos.x = 0;
        // 		}

        // 		if(this.pos.y > height) {
        // 			this.pos.y = 0;
        // 		}
      };

      sketch.Particle.prototype.checkParticles = function(particles) {
        particles.forEach(particle => {
          const d = sketch.dist(
            this.pos.x,
            this.pos.y,
            particle.pos.x,
            particle.pos.y
          );
          if (d < 120) {
            const alpha = sketch.map(d, 0, 120, 0, 0.25);
            sketch.stroke(`rgba(255, 255, 255, ${alpha})`);
            sketch.line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
          }
        });
      };
    };
    // instance a p5 module
    // @param s = the instances 'seed' (??)
    // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
    let myp5 = new p5(s);
  });
</script>

<style>
  #p5-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    height: 100vh;
    width: 100%;
  }

  /* .bg-blur {
    background-color: red;
    color: rgb(255, 238, 0);
  } */
</style>

<div id="p5-wrap" />
