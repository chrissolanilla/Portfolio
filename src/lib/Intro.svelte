<script>
    import { onMount } from 'svelte';
  
    let tagline = '';
    const fullTagline = 'A Developer Shaping the Future';
  
    onMount(() => {
      let i = 0;
      const interval = setInterval(() => {
        tagline += fullTagline[i];
        i++;
        if (i === fullTagline.length) clearInterval(interval);
      }, 100);
    });
  </script>
  
  <section class="intro">
    <h1>Christopher Solanilla</h1>
    <p class="tagline">{tagline}</p>
  </section>
  
  <style>
    .intro {
      text-align: center;
      padding: 2rem;
    }
  
    .tagline {
      font-style: italic;
      color: #009688;
      animation: blinker 10s linear infinite;
    }
  
    @keyframes blinker {
      50% { opacity: 0; }
    }
  </style>
  