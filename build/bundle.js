var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function a(){return t=" ",document.createTextNode(t);var t}function d(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let p;function f(t){p=t}function m(t){(function(){if(!p)throw new Error("Function called outside component initialization");return p})().$$.on_mount.push(t)}const y=[],$=[],h=[],g=[],x=Promise.resolve();let b=!1;function q(t){h.push(t)}const w=new Set;function _(){do{for(;y.length;){const t=y.shift();f(t),k(t.$$)}for(;$.length;)$.pop()();for(let t=0;t<h.length;t+=1){const e=h[t];w.has(e)||(w.add(e),e())}h.length=0}while(y.length);for(;g.length;)g.pop()();b=!1,w.clear()}function k(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}const C=new Set;function A(t,e){t&&t.i&&(C.delete(t),t.i(e))}function S(t,e,n,r){if(t&&t.o){if(C.has(t))return;C.add(t),(void 0).c.push(()=>{C.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function E(t){t&&t.c()}function j(t,n,c){const{fragment:s,on_mount:l,on_destroy:i,after_update:u}=t.$$;s&&s.m(n,c),q(()=>{const n=l.map(e).filter(o);i?i.push(...n):r(n),t.$$.on_mount=[]}),u.forEach(q)}function L(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function N(t,e){-1===t.$$.dirty[0]&&(y.push(t),b||(b=!0,x.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function z(e,o,c,s,l,i,u=[-1]){const a=p;f(e);const d=o.props||{},v=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:n(),dirty:u};let m=!1;v.ctx=c?c(e,d,(t,n,...r)=>{const o=r.length?r[0]:n;return v.ctx&&l(v.ctx[t],v.ctx[t]=o)&&(v.bound[t]&&v.bound[t](o),m&&N(e,t)),n}):[],v.update(),m=!0,r(v.before_update),v.fragment=!!s&&s(v.ctx),o.target&&(o.hydrate?v.fragment&&v.fragment.l(function(t){return Array.from(t.childNodes)}(o.target)):v.fragment&&v.fragment.c(),o.intro&&A(e.$$.fragment),j(e,o.target,o.anchor),_()),f(a)}class R{$destroy(){L(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function O(e){let n,o,c,a,p;return{c(){n=u("div"),o=u("div"),c=u("div"),a=u("span"),v(a,"class","query svelte-3p20zx"),v(a,"contenteditable","true"),v(a,"spellcheck","false"),void 0===e[0]&&q(()=>e[4].call(a)),v(c,"class","search svelte-3p20zx"),v(o,"class","search-wrap wrap svelte-3p20zx"),v(n,"class","omninav svelte-3p20zx")},m(t,r){l(t,n,r),s(n,o),s(o,c),s(c,a),void 0!==e[0]&&(a.textContent=e[0]),p=[d(a,"input",e[4]),d(a,"click",e[3]),d(a,"keydown",e[2]),d(a,"mousedown",e[1]),d(c,"click",e[3]),d(n,"click",e[3])]},p(t,[e]){1&e&&t[0]!==a.textContent&&(a.textContent=t[0])},i:t,o:t,d(t){t&&i(n),r(p)}}}function B(t,e,n){let{query:r}=e;return t.$set=t=>{"query"in t&&n(0,r=t.query)},[r,t=>{t.preventDefault()},t=>{("Enter"===t.key||"Control"===t.key||"ArrowLeft"===t.key||"ArrowRight"===t.key||"Delete"===t.key||"Backspace"===t.key&&1===t.target.textContent.length)&&(console.log(`stopped ${t.key} special case`),t.preventDefault())},()=>{const t=document.querySelector(".query"),e=document.createRange(),n=window.getSelection();e.setStart(t.childNodes[0],t.textContent.length),e.collapse(!0),n.removeAllRanges(),n.addRange(e),t.focus()},function(){r=this.textContent,n(0,r)}]}class D extends R{constructor(t){super(),z(this,t,B,O,c,{query:0})}}function T(e){let n;return{c(){n=u("div"),n.innerHTML='<div class="tree grid-2 svelte-1v9p9tm"><div class="c1 r1 svelte-1v9p9tm"></div> \n    <div class="c2 r1 svelte-1v9p9tm"></div> \n    <div class="c1 r2 svelte-1v9p9tm"></div> \n    <div class="c2 r2 svelte-1v9p9tm"></div> \n    <div class="c1 r3 svelte-1v9p9tm"></div> \n    <div class="c2 r3 svelte-1v9p9tm"></div> \n    <div class="c1 r4 svelte-1v9p9tm"></div> \n    <div class="c2 r4 svelte-1v9p9tm"></div> \n    <div class="c1 r5 svelte-1v9p9tm"></div> \n    <div class="c2 r5 svelte-1v9p9tm"></div> \n    <div class="c1 r6 svelte-1v9p9tm"></div> \n    <div class="c2 r6 svelte-1v9p9tm"></div> \n    <div class="c1 r7 svelte-1v9p9tm"></div> \n    <div class="c2 r7 svelte-1v9p9tm"></div> \n    <div class="c1 r8 svelte-1v9p9tm"></div> \n    <div class="c2 r8 svelte-1v9p9tm"></div> \n    <div class="c1 r9 svelte-1v9p9tm">loading..</div> \n    <div class="c2 r9 svelte-1v9p9tm">~*x+-+x*~*x+-</div> \n    <div class="c1 r10 svelte-1v9p9tm"></div> \n    <div class="c2 r10 svelte-1v9p9tm">|/-\\|/-\\|/-\\|</div></div>',v(n,"class","wrap")},m(t,e){l(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function M(t,e,n){let{query:r=""}=e;m(async()=>{c(o)});let o={source:"path",about:"path",web:{primer_2027:"path",platypus:"path",roslyn_health:"path"},video:{oh_ivy:"path",procedural_disco:"path",NCTRNL:"path"}};const c=t=>{let e=1,n=1;for(const r in t)if("object"==typeof t[r]){document.querySelector(`.c${e}.r${n}`).textContent=r,n--;for(let o=0;o<Object.keys(t[r]).length;o++)e=2,n++,document.querySelector(`.c${e}.r${n}`).textContent=Object.keys(t[r])[o];e=1,n++}else document.querySelector(`.c${e}.r${n}`).textContent=r,e=1,n++};return t.$set=t=>{"query"in t&&n(0,r=t.query)},t.$$.update=()=>{if(1&t.$$.dirty&&r.length>2){document.querySelector(".tree").style.display="",n(0,r=r.substr(1)),console.log(`'${r}'`,r.length);let t=document.querySelectorAll(".c1");t=Array.from(t).filter(t=>t.textContent);for(const e of t)e.textContent.includes(r)&&(e.style.visibility="visible",e.style.borderBottom="2px solid var(--primary-color)");let e=document.querySelectorAll(".c2");e=Array.from(e).filter(t=>t.textContent);for(const t of e)t.textContent.includes(r)&&(t.style.visibility="visible",t.style.borderLeft="2px solid var(--primary-color)")}},[r]}class F extends R{constructor(t){super(),z(this,t,M,T,c,{query:0})}}function H(t){let e,n,r;function o(e){t[1].call(null,e)}let c={query:" "};void 0!==t[0]&&(c.query=t[0]);const s=new D({props:c});$.push(()=>function(t,e,n){const r=t.$$.props[e];void 0!==r&&(t.$$.bound[r]=n,n(t.$$.ctx[r]))}(s,"query",o));const u=new F({props:{query:t[0]}});return{c(){E(s.$$.fragment),n=a(),E(u.$$.fragment)},m(t,e){j(s,t,e),l(t,n,e),j(u,t,e),r=!0},p(t,[n]){const r={};var o;!e&&1&n&&(e=!0,r.query=t[0],o=()=>e=!1,g.push(o)),s.$set(r);const c={};1&n&&(c.query=t[0]),u.$set(c)},i(t){r||(A(s.$$.fragment,t),A(u.$$.fragment,t),r=!0)},o(t){S(s.$$.fragment,t),S(u.$$.fragment,t),r=!1},d(t){L(s,t),t&&i(n),L(u,t)}}}function P(t,e,n){let r;return[r,function(t){r=t,n(0,r)}]}return new class extends R{constructor(t){super(),z(this,t,P,H,c,{})}}({target:document.body,props:{name:"jim"}})}();
//# sourceMappingURL=bundle.js.map
