
    <svelte:head>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js"></script>

    </svelte:head>
    <script lang="ts">
    function scrollToContent() {
        const contentElement = document.querySelector('.content');
        if(contentElement)
            contentElement.scrollIntoView({ behavior: 'smooth' });
    }

    import { onMount } from 'svelte';
    onMount(() => {
        VANTA.NET({
            el: "#vanta-element", // Target element ID
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xa739b6,
            backgroundColor: 0x211443,
            points: 6.00
        });
    });
    </script>

    <div id="vanta-element" class="intro">
    <!-- Your content here -->
    </div>

    <div class="intro">
    <div class="name-container">
        <h2 class="hi">Hi, I'm</h2>
        <h1 class="name">Christopher Solanilla,</h1>
        <h2 class="who">a developer</h2>
        <div class="links">
            <a href="https://github.com/chrissolanilla">GitHub</a>
            <a href="https://www.linkedin.com/in/christopher-solanilla-837299224/">LinkedIn</a>
            <a href="mailto:chrissolanilla@gmail.com">Email</a>
        </div>
    </div>
    <button id="down" on:click={scrollToContent}>
        <svg width="192" height="96" version="1.1" viewBox="-2 -2 196 100" xmlns="http://www.w3.org/2000/svg">
            <path d="m12 12 84 72 84-72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" style="paint-order:stroke fill markers"></path>
        </svg>
    </button>
    </div>
    <div class="content">
    <h1 class="projects">Projects</h1>
    <div class="card-container">

        <a href="https://bustopher.itch.io/yatagarasu-sunshine" target="_blank" class="card">
            <div class="thumbnail3" style="--url: url('/thumbnails/tanks.png');">
                <img src="screnshot1.png" alt="screenshot">
            </div>
            <div class="title">Yatagarasu Sunshine</div>
            <p class="desc">A third person 3D bullet-hell game that was made in two days during the FIEA Game Jam. The game was made in Unreal Engine 5 and runs on windows and Linux x86. </p>
        </a>

        <a href="https://codeclash.app" target="_blank" class="card">
            <div class="thumbnail2" style="--url: url('/thumbnails/tanks.png');">
                <img src="codeclashgame.PNG" alt="screenshot">
            </div>
            <div class="title">Code Clash</div>
            <p class="desc">An online competative programing game where users can battle each other in a 1v1 to see who can solve leetcode problems faster. Elo system and ranking included.</p>
        </a>
        <a href="https://chessconnect.xyz/threeD/test.html" target="_blank" class="card">
            <div class="thumbnail" style="--url: url('/thumbnails/chess10.png');">
                <img src="chessconnect3d.PNG" alt="screenshot">
            </div>
            <div class="title">Chess Connect</div>
            <p class="desc">A Chess theme'd contact manager that also includes a physics engine written in vanilla javascript at this page.</p>
        </a>
        
        <a href="https://chibichain.com" target="_blank" class="card">
            <div class="thumbnail2" style="--url: url('/thumbnails/game-of-life.png');">
                <img src="Chibichain.PNG" alt="screenshot">
            </div>
            <div class="title">Chibi Chain</div>
            <p class="desc">A free linktree alternative with an anime theme and extra features such as adding songs to your page.</p>
        </a>
        
        <a href="https://kawaiikulture.shop" target="_blank" class="card">
            <div class="thumbnail" style="--url: url('/thumbnails/softbody-tetris.png');">
                <img src="kawaiikulture.PNG" alt="screenshot">
            </div>
            <div class="title">Kawaii Kulture</div>
            <p class="desc">My own personal drop shipping business where I sell anime clothes and merchandise from japan.</p>
        </a>
    </div>
    </div>

    <style>

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
        position: absolute; /* Position it at the bottom of the intro section */
        bottom: calc(var(--scale) * 1.6731588443448342);
        opacity: 1; /* Adjust the opacity to make it visible */
        transition: opacity 0.3s ease; /* Transition for the opacity change */
    }
        .name-container > .name {
        font-size: calc(var(--scale) * 2);
    }
    .hi {
        text-align: start;
        color:white;
    }
    .who {
        color: rgb(27, 143, 211);
        font-weight: bold;
    }
    .intro {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        text-align: center;
    }
    .projects{
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    }

    .card {
        display: inline-flex;
        flex-direction: column;
        position: relative;
        height: 400px;
        border-radius: 4px;
        border: 1px solid var(--hr);
        font-size: 11pt;
        padding: 8px;
        overflow: hidden;
        transition: .2s transform;
        color: var(--fg);
        text-align: initial;
        background: var(--content-bg);
        text-decoration: none;
        width: calc((100% - 32px) / 3);
        margin-bottom: 32px;
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
        width: 100%;
        height: 75%;
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


    .title {
        font-size: var(--scale);
        font-weight: bold;
        margin-top: 8px;
    }

    .desc {
        margin-top: 4px;
        color: var(--secondary-fg);
    }

    @media (max-width: 768px) {
        .card {
            width: calc(100% - 16px); /* Full width on smaller screens */
        }
    }

    #vanta-element {
    position: fixed; /* or 'absolute' if that works better for your layout */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1000000; /* Behind everything else */
}


    </style>


