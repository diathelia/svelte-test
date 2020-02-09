
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Search.svelte generated by Svelte v3.18.1 */

    const { console: console_1 } = globals;
    const file = "src\\Search.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			attr_dev(span, "class", "query svelte-11o15l4");
    			attr_dev(span, "contenteditable", "true");
    			attr_dev(span, "spellcheck", "false");
    			if (/*query*/ ctx[0] === void 0) add_render_callback(() => /*span_input_handler*/ ctx[4].call(span));
    			add_location(span, file, 124, 4, 3140);
    			attr_dev(div0, "class", "search svelte-11o15l4");
    			add_location(div0, file, 123, 2, 3088);
    			attr_dev(div1, "class", "navbar my-1 svelte-11o15l4");
    			add_location(div1, file, 122, 0, 3033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);

    			if (/*query*/ ctx[0] !== void 0) {
    				span.textContent = /*query*/ ctx[0];
    			}

    			dispose = [
    				listen_dev(span, "input", /*span_input_handler*/ ctx[4]),
    				listen_dev(span, "click", /*positionCursor*/ ctx[3], false, false, false),
    				listen_dev(span, "keydown", /*queryKeydown*/ ctx[2], false, false, false),
    				listen_dev(span, "mousedown", /*queryMousedown*/ ctx[1], false, false, false),
    				listen_dev(div0, "click", /*positionCursor*/ ctx[3], false, false, false),
    				listen_dev(div1, "click", /*positionCursor*/ ctx[3], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*query*/ 1 && /*query*/ ctx[0] !== span.textContent) {
    				span.textContent = /*query*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { query } = $$props;

    	// #cancel mouse-selection of query text
    	const queryMousedown = e => {
    		e.preventDefault();
    	};

    	// #cancel special keys
    	const queryKeydown = e => {
    		if (e.key === "Enter" || e.key === "Control" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Delete" || e.key === "Backspace" && e.target.textContent.length === 1) {
    			console.log(`stopped ${e.key} special case`);

    			// find some way of ensuring query[0] is always a whitespace
    			e.preventDefault(); // will stop event bubbling to keypress
    		}
    	};

    	// set consts here for positionCursor to save redeclaring
    	// positionCursor function from
    	// https://www.geeksforgeeks.org/how-to-set-cursor-position-in-content-editable-element-using-javascript/
    	const positionCursor = () => {
    		// relevant text-element
    		const tag = document.querySelector(".query");

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
    	};

    	const writable_props = ["query"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function span_input_handler() {
    		query = this.textContent;
    		$$invalidate(0, query);
    	}

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	$$self.$capture_state = () => {
    		return { query };
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	return [query, queryMousedown, queryKeydown, positionCursor, span_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { query: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[0] === undefined && !("query" in props)) {
    			console_1.warn("<Search> was created without expected prop 'query'");
    		}
    	}

    	get query() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Tree.svelte generated by Svelte v3.18.1 */

    const { Object: Object_1 } = globals;
    const file$1 = "src\\Tree.svelte";

    function create_fragment$1(ctx) {
    	let div16;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let t14;
    	let div15;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			t14 = space();
    			div15 = element("div");
    			attr_dev(div0, "class", "c1 r1");
    			add_location(div0, file$1, 94, 2, 3024);
    			attr_dev(div1, "class", "c2 r1");
    			add_location(div1, file$1, 95, 2, 3049);
    			attr_dev(div2, "class", "c1 r2");
    			add_location(div2, file$1, 96, 2, 3074);
    			attr_dev(div3, "class", "c2 r2");
    			add_location(div3, file$1, 97, 2, 3099);
    			attr_dev(div4, "class", "c1 r3");
    			add_location(div4, file$1, 98, 2, 3124);
    			attr_dev(div5, "class", "c2 r3");
    			add_location(div5, file$1, 99, 2, 3149);
    			attr_dev(div6, "class", "c1 r4");
    			add_location(div6, file$1, 100, 2, 3174);
    			attr_dev(div7, "class", "c2 r4");
    			add_location(div7, file$1, 101, 2, 3199);
    			attr_dev(div8, "class", "c1 r5");
    			add_location(div8, file$1, 102, 2, 3224);
    			attr_dev(div9, "class", "c2 r5");
    			add_location(div9, file$1, 103, 2, 3249);
    			attr_dev(div10, "class", "c1 r6");
    			add_location(div10, file$1, 104, 2, 3274);
    			attr_dev(div11, "class", "c2 r6");
    			add_location(div11, file$1, 105, 2, 3299);
    			attr_dev(div12, "class", "c1 r7");
    			add_location(div12, file$1, 106, 2, 3324);
    			attr_dev(div13, "class", "c2 r7");
    			add_location(div13, file$1, 107, 2, 3349);
    			attr_dev(div14, "class", "c1 r8");
    			add_location(div14, file$1, 108, 2, 3374);
    			attr_dev(div15, "class", "c2 r8");
    			add_location(div15, file$1, 109, 2, 3399);
    			attr_dev(div16, "class", "grid-2 svelte-vqet6s");
    			add_location(div16, file$1, 93, 0, 3000);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div0);
    			append_dev(div16, t0);
    			append_dev(div16, div1);
    			append_dev(div16, t1);
    			append_dev(div16, div2);
    			append_dev(div16, t2);
    			append_dev(div16, div3);
    			append_dev(div16, t3);
    			append_dev(div16, div4);
    			append_dev(div16, t4);
    			append_dev(div16, div5);
    			append_dev(div16, t5);
    			append_dev(div16, div6);
    			append_dev(div16, t6);
    			append_dev(div16, div7);
    			append_dev(div16, t7);
    			append_dev(div16, div8);
    			append_dev(div16, t8);
    			append_dev(div16, div9);
    			append_dev(div16, t9);
    			append_dev(div16, div10);
    			append_dev(div16, t10);
    			append_dev(div16, div11);
    			append_dev(div16, t11);
    			append_dev(div16, div12);
    			append_dev(div16, t12);
    			append_dev(div16, div13);
    			append_dev(div16, t13);
    			append_dev(div16, div14);
    			append_dev(div16, t14);
    			append_dev(div16, div15);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { query } = $$props;

    	// add to videos: tidbits, PAVEMENT_2017_AH18, ...
    	// 'source' could be called 'root', 'home' ...
    	// placeholder tree object
    	let tree = {
    		source: "path",
    		about: "path",
    		web: {
    			primer_2027: "path",
    			platypus: "path",
    			roslyn_health: "path"
    		},
    		video: {
    			oh_ivy: "path",
    			procedural_disco: "path",
    			NCTRNL: "path"
    		}
    	};

    	// 1. set 'branch' to col-1 ONCE, no newline
    	// 2. for subbranch length, add elm to col-2, then newline
    	// 3. after last subbranch elm, newline and set back to col-1
    	const createTree = obj => {
    		let c = 1;
    		let r = 1;

    		for (const branch in obj) {
    			if (typeof obj[branch] == "object") {
    				document.querySelector(`.c${c}.r${r}`).textContent = branch;

    				// console.log(branch, r, c);
    				r--;

    				for (let i = 0; i < Object.keys(obj[branch]).length; i++) {
    					c = 2;
    					r++;

    					// console.log(Object.keys(obj[branch])[i], r, c);
    					document.querySelector(`.c${c}.r${r}`).textContent = Object.keys(obj[branch])[i];
    				}

    				c = 1;
    				r++;
    			} else {
    				// console.log(branch, r, c);
    				document.querySelector(`.c${c}.r${r}`).textContent = branch;

    				c = 1;
    				r++;
    			}
    		}
    	};

    	onMount(async () => {
    		createTree(tree);
    	});

    	const writable_props = ["query"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tree> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	$$self.$capture_state = () => {
    		return { query, tree };
    	};

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    		if ("tree" in $$props) $$invalidate(1, tree = $$props.tree);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*query*/ 1) {
    			 if (query) {
    				$$invalidate(0, query = query.substr(1));

    				// console.log(Object.keys(tree));
    				// demo highlight on query-nav match
    				if (query === tree.source) {
    					document.querySelector(".c1.r3").style.color = "yellow";
    					document.querySelector(".c1.r3").style.borderBottom = "solid 2px yellow";
    					document.querySelector(".c2.r3").style.color = "yellow";
    					document.querySelector(".c2.r3").style.borderBottom = "solid 2px yellow";
    					document.querySelector(".c2.r4").style.color = "yellow";
    					document.querySelector(".c2.r4").style.borderBottom = "solid 2px yellow";
    					document.querySelector(".c2.r5").style.color = "yellow";
    					document.querySelector(".c2.r5").style.borderBottom = "solid 2px yellow";
    				}
    			}
    		}
    	};

    	return [query];
    }

    class Tree extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { query: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tree",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[0] === undefined && !("query" in props)) {
    			console.warn("<Tree> was created without expected prop 'query'");
    		}
    	}

    	get query() {
    		throw new Error("<Tree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Omninav.svelte generated by Svelte v3.18.1 */

    function create_fragment$2(ctx) {
    	let updating_query;
    	let t;
    	let current;

    	function search_query_binding(value) {
    		/*search_query_binding*/ ctx[1].call(null, value);
    	}

    	let search_props = { query: " " };

    	if (/*queryProp*/ ctx[0] !== void 0) {
    		search_props.query = /*queryProp*/ ctx[0];
    	}

    	const search = new Search({ props: search_props, $$inline: true });
    	binding_callbacks.push(() => bind(search, "query", search_query_binding));

    	const tree = new Tree({
    			props: { query: /*queryProp*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    			t = space();
    			create_component(tree.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tree, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const search_changes = {};

    			if (!updating_query && dirty & /*queryProp*/ 1) {
    				updating_query = true;
    				search_changes.query = /*queryProp*/ ctx[0];
    				add_flush_callback(() => updating_query = false);
    			}

    			search.$set(search_changes);
    			const tree_changes = {};
    			if (dirty & /*queryProp*/ 1) tree_changes.query = /*queryProp*/ ctx[0];
    			tree.$set(tree_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(tree.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			transition_out(tree.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tree, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let queryProp;

    	function search_query_binding(value) {
    		queryProp = value;
    		$$invalidate(0, queryProp);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("queryProp" in $$props) $$invalidate(0, queryProp = $$props.queryProp);
    	};

    	return [queryProp, search_query_binding];
    }

    class Omninav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Omninav",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.18.1 */
    const file$2 = "src\\App.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let current;
    	const omninav = new Omninav({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(omninav.$$.fragment);
    			attr_dev(main, "class", "container");
    			add_location(main, file$2, 8, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(omninav, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(omninav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(omninav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(omninav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: 'jim'
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
