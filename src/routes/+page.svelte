
<svelte:head>

<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script> -->
<!-- <script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js"></script> -->

</svelte:head>
<script lang="ts">
	import { onMount, onDestroy, tick } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
	import NET from "vanta/dist/vanta.net.min.js";
	import Header from "$lib/Header.svelte";

	let vantaEffect: any = null;

	// ---- GIF -> 3D toggle ----
	let showModel = false;
	let mountEl: HTMLDivElement | null = null;

	let renderer: THREE.WebGLRenderer | undefined;
	let scene: THREE.Scene | undefined;
	let camera: THREE.PerspectiveCamera | undefined;
	let raf = 0;
	let resizeHandler: (() => void) | undefined;

	async function showThree() {
		console.log("we are doing our fucntion")
	  showModel = true;
	  await tick(); // ensure mountEl exists
	  initThree();
	}

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function initThree() {
  if (!mountEl) return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    mountEl.clientWidth / mountEl.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.2, 2.2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
  mountEl.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1.1);
  scene.add(hemi);

  // helpful: one directional light so models don’t look flat
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(3, 3, 3);
  scene.add(dir);

  // controls (optional but nice)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new GLTFLoader();
  loader.load(
    '/otherface.glb',                                   // put file in /static
    (gltf) => {
      const root = gltf.scene;
      // make sure it’s not microscopic or huge
      root.scale.setScalar(1);                          // adjust if needed
      root.position.set(0, 0, 0);
      scene!.add(root);
      console.log('GLB loaded:', root);
    },
    undefined,
    (err) => console.error('GLB load error:', err)
  );

  resizeHandler = () => {
    if (!mountEl || !camera || !renderer) return;
    const w = mountEl.clientWidth || 1;
    const h = mountEl.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', resizeHandler);

  const loop = () => {
    raf = window.requestAnimationFrame(loop);
    controls.update();
    renderer!.render(scene!, camera!);
  };
  loop();
}


	onMount(() => {
	  // init Vanta with the SAME THREE instance
	  vantaEffect = NET({
		el: "#vanta-element",
		THREE, // <- critical: pass the imported THREE
		mouseControls: true,
		touchControls: true,
		gyroControls: false,
		minHeight: 200.0,
		minWidth: 200.0,
		scale: 1.0,
		scaleMobile: 1.0,
		color: 0xa739b6,
		backgroundColor: 0x211443,
		points: 6.0,
	  });
	});

	onDestroy(() => {
	  // cancelAnimationFrame(raf);
	if (raf !== null && typeof window !== 'undefined' && 'cancelAnimationFrame' in window) {
		window.cancelAnimationFrame(raf);
	  }
	  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
	  if (renderer) {
		renderer.dispose();
		renderer.domElement?.remove();
	  }
	  if (vantaEffect) vantaEffect.destroy();
	});


	function scrollToContent() {
        const contentElement = document.querySelector('.content');
        if(contentElement)
            contentElement.scrollIntoView({ behavior: 'smooth' });
    }
    import { goto } from '$app/navigation';
    function goToChat() {
        goto('/sayHi');
    }
    function goToClock(){
        goto('/clock');
    }

</script>


<Header />
<div id="vanta-element" class="intro">
</div>

<header class="intro">
	<div class="headGif">
		{#if !showModel}
			<img src="out.gif" alt="head gif" class="gifButton" on:click={showThree}
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && showThree()}
			>
		{:else}
			<div class="threeHolder" bind:this={mountEl} />
		{/if}
	</div>

    <div class="name-container">
        <h2 class="hi">Hi, I'm</h2>
        <h1 class="name">Christopher Solanilla,</h1>
        <h2 class="who">a developer</h2>
        <nav class="links">
            <a href="https://github.com/chrissolanilla">GitHub</a>
            <a href="https://bustopher.itch.io/" target="_blank" >Itch.io</a>
            <a href="https://www.linkedin.com/in/christopher-solanilla-837299224/">LinkedIn</a>
            <a href="mailto:chrissolanilla@gmail.com">Email</a>
        </nav>
    </div>
    <button id="down" on:click={scrollToContent}>
        <svg width="192" height="96" version="1.1" viewBox="-2 -2 196 100" xmlns="http://www.w3.org/2000/svg">
            <path d="m12 12 84 72 84-72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" style="paint-order:stroke fill markers"></path>
        </svg>
    </button>
</header>

<main class="content">
    <h1 class="projects">Projects</h1>
        <div class="card-container">

            <section class="card">
                <a href="https://bustopher.itch.io/what-kills-you-makes-you-stronger" target="_blank" class="">
                    <div class="thumbnail3" >
                        <img src="Wkymys.png" alt="steps">
                    </div>
                    <div class="title">What Kills You Makes You Stronger</div>
                    <p class="desc">A game made in 3 days for the Jacksepticye Spooky Game Jam where you play as a ghost solving puzzles. Ranked 318th place out of 1,164 entries.</p>
                </a>
			</section>

            <section class="card">
                <a href="https://chrissolanilla.github.io/Steps-website/" target="_blank" class="">
                    <div class="thumbnail3" >
                        <img src="steps.png" alt="steps">
                    </div>
                    <div class="title">S.T.E.P.S.</div>
                    <p class="desc">An Arcade Dance Rhythmn Game Machine tracking player pose while delevering a classic DDR/PIU experience. This was my senior design project for my Undergrad in Computer Engineering I lead a group of 5 engineers to design and fabricate the circuits, gameplay, and optics aspects. </p>
                </a>
			</section>

            <section class="card">
                <a href="https://github.com/chrissolanilla/Deck-builder" target="_blank" class="">
                    <div class="thumbnail2" >
                        <img src="CardsOfMayhem.png" alt="screenshot">
                    </div>
                    <div class="title">Cards of Mayhem</div>
                    <p class="desc">A 3D real-time action card game deck builder that combines FPS and Yugioh mechanics. Lead a team of 4 developers where I made the base engine mechanics for card system and deck building. Made in Godot 4.</p>
                </a>

            </section>

            <section class="card">
                <a href="https://bustopher.itch.io/yatagarasu-sunshine" target="_blank" class="">
                    <div class="thumbnail3" >
                        <img src="screnshot1.png" alt="screenshot">
                    </div>
                    <div class="title">Yatagarasu Sunshine</div>
                    <p class="desc">A third person 3D bullet-hell game that was made in two days during the FIEA Game Jam. The game was made in Unreal Engine 5 and runs on windows and Linux x86. </p>
                </a>

            </section>

            <section class="card">
                <a href="https://codeclash.app" target="_blank" class="">
                    <div class="thumbnail2" >
                        <img src="codeclashgame.PNG" alt="screenshot">
                    </div>
                    <div class="title">Code Clash</div>
                    <p class="desc">An online competative programing game where users can battle each other in a 1v1 to see who can solve leetcode problems faster. Elo system and ranking included.</p>
                </a>

            </section>

            <section class="card">
                <a href="https://github.com/Swolis/4331sp14/tree/main/Frontend/threeD" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="chessconnect3d.PNG" alt="screenshot">
                    </div>
                    <div class="title">Chess Connect</div>
                    <p class="desc">A Chess theme'd contact manager that also includes a physics engine written in vanilla javascript at this page.</p>
                </a>

            </section>

            <section class="card">
                <a href="https://chibichain.com" target="_blank" class="">
                    <div class="thumbnail2" >
                        <img src="Chibichain.PNG" alt="screenshot">
                    </div>
                    <div class="title">Chibi Chain</div>
                    <p class="desc">A free linktree alternative with an anime theme and extra features such as adding songs to your page.</p>
                </a>

            </section>


            <section class="card">
                <a href="https://github.com/chrissolanilla/busto-browser" target="_blank" class="">
                    <div class="thumbnail2" >
                        <img style="height: 350px;"src="BustoBrowser.png" alt="screenshot">
                    </div>
                    <div class="title">Busto Browser</div>
                    <p class="desc">A heavily under development custom browser made with Vulkan in C++. Right now it renders HTML and some CSS, with no plans of utilizing JavaScript in place of my own web language(coming soon)</p>
                </a>

            </section>
            <section class="card">
                <a href="https://kawaiikulture.shop" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="kawaiikulture.PNG" alt="screenshot">
                    </div>
                    <div class="title">Kawaii Kulture</div>
                    <p class="desc">My own personal drop shipping business where I sell anime clothes and merchandise from japan.</p>
                </a>

            </section>
    </div>

	<h1 style="text-align: center;">Professional Work</h1>
	<div class="card-container">

		<section class="card">
                <a href="https://legacy5.netlify.app/" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="LEGACY5.png" alt="screenshot"> </div>
                    <div class="title">Legacy 5</div>
                    <p class="desc">A simple website I made for Legacy 5 as hired freelance developer. It showcases how private equity can be a valuale investment for tomorrow.</p>
				</a>

		</section>

		<section class="card">
                <a href="https://ppaths.netlify.app/" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="PPaths.png" alt="screenshot"> </div>
                    <div class="title">PPAThs</div>
                    <p class="desc">Another simple website I made for PPaths as hired freelance developer. It has Stripe integration for payments so people can donate to organizations that take care of children.</p>
				</a>

		</section>

		<section class="card">
                <a href="https://game.triangle-puzzle.com/" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="Triangles.png" alt="screenshot"> </div>
                    <div class="title">Triangle Puzzle</div>
                    <p class="desc">A Unity 2D Triangle Puzzle Game I made while hired as an OPS Student working for Dr. Enrique Ortiz at UCF. I ended up majorly overhauling the feedback system of the game by providing a visual star system and incorperated my own email server for teachers to recieve when students are finished playing the game with stat metrics included. </p>
				</a>

		</section>

		<section class="card">
                <a href="https://www.mdtronics.net/" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="MDTronics.png" alt="screenshot"> </div>
                    <div class="title">MDTronics</div>
                    <p class="desc">A complete website for funnelling potential clients for medical equipment consulting made for MDTronics. I was in charge of the entire development of the site front to back.</p>
				</a>

		</section>

		<section class="card">
                <a href="https://materia.ucf.edu/" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="Materia.png" alt="screenshot"> </div>
                    <div class="title">Materia</div>
                    <p class="desc">A UCF affiliated Web Game Ehgine made for creating engaging apps. Both students and teachers can create tiny gradable games for their classes or for personal use. I played a big part in migrating the legacy PhP backend to Django as well numerous quality of life changes while working for Techrangers.</p>
				</a>

		</section>

		<section class="card">
                <a href="https://materia.ucf.edu/widgets/103-associations" target="_blank" class="">
                    <div class="thumbnail">
                        <img src="Associations.png" alt="screenshot"> </div>
                    <div class="title">Associations</div>
                    <p class="desc">A Materia widget Web Game that plays similar to NYT's Connections game. Teachers can create their own game of Associations with their own dimensions and get feedback from studnets who play their Associations game. Made all of my own libraries purely in HTML/CSS/JS for optimized performance.</p>
				</a>

		</section>

	</div>
</main>



<style lang="scss">

    :global(body) {
        overflow-x: hidden;
    }

	.headGif {
		.threeHolder {
		width:500px;
		height:500px;
		border-radius: 10%;
		overflow:hidden;
		z-index: 10;
	}
		img {
			border-radius: 10%;

			height: 500px;
			cursor: pointer;
			transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
			box-shadow: 0 4px 14px rgba(0,0,0,.18);
		}

		img:hover {
			transform: scale(1.03);
			box-shadow: 0 12px 28px rgba(0,0,0,.35);
			filter: brightness(1.05) saturate(1.05);
		}

		img:focus-visible {
			outline: 3px solid #3ac2ff;
			outline-offset: 3px;
		}
	}

    .btn-primary {
    --btn-color: #ff7cc4; /* Primary button color set to #ff7cc4 */
    }

    .btn {
        display: inline-flex;
        height: 3rem;
        min-height: 3rem;
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem; /* Adjusted for simplicity */
        border-color: transparent;
        padding: 0 1rem;
        text-align: center;
        font-size: 0.875rem;
        line-height: 1em;
        gap: 0.5rem;
        font-weight: 600;
        text-decoration-line: none;
        transition-duration: 200ms;
        transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        border-width: 1px; /* Adjusted for simplicity */
        transition-property: color, background-color, border-color, opacity, box-shadow, transform;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        background-color: var(--btn-color); /* Use the primary color for the background */
        color: #fff; /* Assuming white text color for contrast */
    }

    button, [role="button"] {
    cursor: pointer;
    }

    button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
    }

    button, select {
        text-transform: none;
    }

    .OtherSection {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    #down {
        background-color: transparent; /* Make the button background transparent */
        border: none; /* Remove any default button border */
        cursor: pointer; /* Change the mouse cursor to indicate it's clickable */
        padding: calc(var(--scale) * 0.25); /* Responsive padding based on your --scale variable */
    }

    #down > svg {
        width: auto;
        height: calc(var(--scale)); /* Make the SVG responsive based on the --scale variable */
        fill: currentColor; /* Use the current text color for the SVG */
    }

    /* Make the SVG button more visible and ensure it's not displayed none as in your friend's styles */
    .intro > #down {
        display: block; /* or inline-block depending on your layout needs */
        bottom: calc(var(--scale) * 1.6731588443448342);
		bottom:10%;
        opacity: 1; /* Adjust the opacity to make it visible */
        transition: opacity 0.3s ease; /* Transition for the opacity change */
    }
    .name-container > .name {
        font-size: calc(var(--scale) * 2);
		margin: 0;
    }
    .hi {
        text-align: start !important;
        color:white !important;
		margin: 0;
    }
    .who {
        color: rgb(27, 143, 211) !important;
        font-weight: bold !important;
    }
    .intro {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100vw !important;
        height: 100vh !important;
        text-align: center !important;
    }
    .projects{
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
    }

    .card-container {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 16px !important;
        justify-content: center !important;
    }

    .card {
		display: flex;
		flex-direction: column;
		background-color: var(--content-bg);
		border-radius: 4px;
		padding: 0.5rem;
        // flex-direction: column !important;
        // height: 400px !important;
        // border-radius: 4px !important;
        // border: 1px solid var(--hr) !important;
        // font-size: 11pt !important;
        // padding: 8px !important;
        // overflow: hidden !important;
        // transition: .2s transform !important;
        // color: var(--fg) !important;
        // text-align: initial !important;
        // background: var(--content-bg) !important;
        // text-decoration: none !important;
        //
        // margin-bottom: 32px !important;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .thumbnail img {
        width: 100%;
        height: auto;
        border-radius: 4px;
    }

    .thumbnail2 img {
        width: 100%;
        height: auto;
        border-radius: 4px;
    }
    .thumbnail3 {
        // height: 61%;
        border-radius: 4px;
        padding-bottom: 0%;
        margin-bottom: 0%;
    }
    .thumbnail3 img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        padding-bottom: 0%;
        margin-bottom: 0%;
    }

    .links a {
        padding: 12px;
    }
    .title {
        font-size: var(--scale);
        font-weight: bold;
        margin-top: 8px;
		text-align: center;
    }

    .desc {
        margin-top: 4px;
        color: #fff;
    }

    @media (max-width: 768px) {
        .card-container {
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        section {
            width: 22rem;
        }

		.headGif {
			img {
				height:400px;
			}
        }

    }

    @media (min-width: 801px) {
        .card {
            max-width: calc((100% - 32px) / 3);
        }
    }

    #vanta-element {
        // position: fixed; /* or 'absolute' if that works better for your layout */
		position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1000000; /* Behind everything else */
    }


</style>


