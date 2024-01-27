<script>
    import Intro from '$lib/Intro.svelte';
    import Education from '$lib/Education.svelte';
    import Experience from '$lib/Experience.svelte';
    import Projects from '$lib/Projects.svelte';
  </script>
  
  <main>
    <Intro />
    <Education />
    <Experience />
    <Projects />
  </main>
  
  <style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  </style>
  