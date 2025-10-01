
<script>
	let open = false
	const closeOnEsc = (e) => e.key === 'Escape' && (open = false)
</script>

<svelte:window on:keydown={closeOnEsc} />

<nav class="nav">
	<div class="logo">
		<img src="moonLaugh.gif" />
		<h1>Christopher Solanilla</h1>
	</div>

	<div class="links">
        <!-- <a href="/">Home</a> -->
        <!-- <a href="/about">About</a> -->
        <!-- <a href="/projects">Projects</a> -->


		<!-- <div class="icons"> -->
		<!-- resume icon-->
		<!-- class="text-hoverable animate-fade-left flex items-center justify-center gap-2" -->
		<a
		class ="resumeA"
		  href="https://drive.google.com/file/d/1dzZtw0_FFlZX52O3-2Pb6zLKfB4-G0__/view?usp=sharing"
		  target="_blank"
		>
		  <p class="resume">
			<svg
			  stroke="currentColor"
			  fill="currentColor"
			  stroke-width="0"
			  viewBox="0 0 512 512"
			  height="2em"
			  width="2em"
			  xmlns="http://www.w3.org/2000/svg"
			>
			  <path d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4zm-92 160H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32zm0-80H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32z"></path>
			  <path d="M419.22 188.59 275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41z"></path>
			</svg>
		  </p>

			Resume
		</a>

		<!-- itch icon-->
		<a
		class="itchA" href="https://bustopher.itch.io/" target="_blank"
		>
			<svg xmlns="http://www.w3.org/2000/svg" height="2rem" width="2rem" viewBox="0 0 245.37069 220.73612"><path d="M31.99 1.365C21.287 7.72.2 31.945 0 38.298v10.516C0 62.144 12.46 73.86 23.773 73.86c13.584 0 24.902-11.258 24.903-24.62 0 13.362 10.93 24.62 24.515 24.62 13.586 0 24.165-11.258 24.165-24.62 0 13.362 11.622 24.62 25.207 24.62h.246c13.586 0 25.208-11.258 25.208-24.62 0 13.362 10.58 24.62 24.164 24.62 13.585 0 24.515-11.258 24.515-24.62 0 13.362 11.32 24.62 24.903 24.62 11.313 0 23.773-11.714 23.773-25.046V38.298c-.2-6.354-21.287-30.58-31.988-36.933C180.118.197 157.056-.005 122.685 0c-34.37.003-81.228.54-90.697 1.365zm65.194 66.217a28.025 28.025 0 0 1-4.78 6.155c-5.128 5.014-12.157 8.122-19.906 8.122a28.482 28.482 0 0 1-19.948-8.126c-1.858-1.82-3.27-3.766-4.563-6.032l-.006.004c-1.292 2.27-3.092 4.215-4.954 6.037a28.5 28.5 0 0 1-19.948 8.12c-.934 0-1.906-.258-2.692-.528-1.092 11.372-1.553 22.24-1.716 30.164l-.002.045c-.02 4.024-.04 7.333-.06 11.93.21 23.86-2.363 77.334 10.52 90.473 19.964 4.655 56.7 6.775 93.555 6.788h.006c36.854-.013 73.59-2.133 93.554-6.788 12.883-13.14 10.31-66.614 10.52-90.474-.022-4.596-.04-7.905-.06-11.93l-.003-.045c-.162-7.926-.623-18.793-1.715-30.165-.786.27-1.757.528-2.692.528a28.5 28.5 0 0 1-19.948-8.12c-1.862-1.822-3.662-3.766-4.955-6.037l-.006-.004c-1.294 2.266-2.705 4.213-4.563 6.032a28.48 28.48 0 0 1-19.947 8.125c-7.748 0-14.778-3.11-19.906-8.123a28.025 28.025 0 0 1-4.78-6.155 27.99 27.99 0 0 1-4.736 6.155 28.49 28.49 0 0 1-19.95 8.124c-.27 0-.54-.012-.81-.02h-.007c-.27.008-.54.02-.813.02a28.49 28.49 0 0 1-19.95-8.123 27.992 27.992 0 0 1-4.736-6.155zm-20.486 26.49l-.002.01h.015c8.113.017 15.32 0 24.25 9.746 7.028-.737 14.372-1.105 21.722-1.094h.006c7.35-.01 14.694.357 21.723 1.094 8.93-9.747 16.137-9.73 24.25-9.746h.014l-.002-.01c3.833 0 19.166 0 29.85 30.007L210 165.244c8.504 30.624-2.723 31.373-16.727 31.4-20.768-.773-32.267-15.855-32.267-30.935-11.496 1.884-24.907 2.826-38.318 2.827h-.006c-13.412 0-26.823-.943-38.318-2.827 0 15.08-11.5 30.162-32.267 30.935-14.004-.027-25.23-.775-16.726-31.4L46.85 124.08c10.684-30.007 26.017-30.007 29.85-30.007zm45.985 23.582v.006c-.02.02-21.863 20.08-25.79 27.215l14.304-.573v12.474c0 .584 5.74.346 11.486.08h.006c5.744.266 11.485.504 11.485-.08v-12.474l14.304.573c-3.928-7.135-25.79-27.215-25.79-27.215v-.006l-.003.002z" color="#000" fill="#fff"/></svg>
		</a>
			<!-- github -->
			<a
			  class="github"
			  href="https://github.com/chrissolanilla"
			  target="_blank"
			>
			  <p class="githubP">
				<svg
				  stroke="currentColor"
				  fill="currentColor"
				  stroke-width="0"
				  viewBox="0 0 496 512"
				  height="2em"
				  width="2em"
				  xmlns="http://www.w3.org/2000/svg"
				>
				  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
				</svg>
			  </p>
			</a>

			<!-- linkedin -->
			<a
			  class="text-hoverable animate-fade-left flex items-center justify-center gap-2"
			  href="https://www.linkedin.com/in/christopher-solanilla-837299224/"
			  target="_blank"
			>
			  <p class="text-[2rem]">
				<svg
				  stroke="currentColor"
				  fill="currentColor"
				  stroke-width="0"
				  viewBox="0 0 448 512"
				  height="2em"
				  width="2em"
				  xmlns="http://www.w3.org/2000/svg"
				>
				  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
				</svg>
			  </p>
			</a>


		<!-- end of icons div-->
		<!-- </div> -->

    </div>
	  <!--hamburg-->
  <button
    class="hamburger" aria-label="Open menu" aria-haspopup="dialog"
    aria-controls="mobile-menu" aria-expanded={open} on:click={() => (open = true)}
	>
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</nav>

{#if open}
  <div class="overlay" role="dialog" aria-modal="true" id="mobile-menu" on:click|self={() => (open = false)}>
    <div class="sheet">
      <button class="close" aria-label="Close menu" on:click={() => (open = false)}>✕</button>
      <a href="https://drive.google.com/file/d/1dzZtw0_FFlZX52O3-2Pb6zLKfB4-G0__/view?usp=sharing" target="_blank" on:click={() => (open = false)}>Resume</a>
      <a href="https://bustopher.itch.io/" on:click={() => (open = false)} target="_blank">Itch.io</a>
      <a href="https://github.com/chrissolanilla" on:click={() => (open = false)} target="_blank">Github</a>
      <a href="https://www.linkedin.com/in/christopher-solanilla-837299224/" on:click={() => (open = false)} target="_blank">LinkedIn</a>
    </div>
  </div>
{/if}

<style lang="scss">
  a:hover {
	  color:#ff7cc4;
	  border-radius: 0.75rem;
	  outline: 2px solid #ff7cc4;
  }
  a:focus-visible {
	  color:#ff7cc4;
	  border-radius: 0.75rem;
	  outline: 2px solid #ff7cc4;
  }
  p {
	  margin: 0;
  }
  h1 { margin: 0; }

  .logo {
	  display: flex;
	  gap: 1rem;
	  img {
		  max-width: 50px;
	  }
  }

  .resumeA {
	display: flex;
	gap: 2px;
	align-items: center;
  }

  .nav {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #000;
    color: #fff;
    min-height: 56px;
    padding: 12px 16px;
  }

  .links {
    display: flex;
    gap: 2rem;
	align-items: center;
  }

  .links a { color: #ff7cc4; text-decoration: none; }
  .links a:hover { text-decoration: underline; }

  .hamburger {
    display: none;
    background: transparent;
    border: 0;
    color: #fff;
    cursor: pointer;
  }

  @media (max-width: 800px) {
    .links { display: none; }
    .hamburger { display: inline-flex; }
	.logo {
		  gap: 1.5rem;
		h1 {
			  font-size: 1.5rem;
		  }
		img {
			  max-width: 60px;
		}
	}
  }

  //modal
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.6);
    display: grid;
    place-items: start end; // slide in from right
    z-index: 9999;
  }

  .sheet {
    background: #111;
    color: #fff;
    width: min(85vw, 320px);
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: -8px 0 24px rgba(0,0,0,.4);
    animation: slideIn .18s ease-out;
  }

  .sheet a {
    color: #ff7cc4;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 8px 0;
  }

  .sheet a:focus { outline: 2px solid #ff7cc4; outline-offset: 2px; }

  .close {
    align-self: flex-end;
    background: #222;
    border: 1px solid #333;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 12px;
  }

  @keyframes slideIn {
    from { transform: translateX(20px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
</style>

