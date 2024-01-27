<script>
    const projects = [
      {
        title: 'CodeClash.app',
        description: 'An online competitive programming game.',
        imageUrl: '/path/to/codeclash-image.jpg',
        link: 'https://codeclash.app'
      },
      // Add other projects similarly
    ];
  </script>
  
  <section class="projects">
    <h2>Projects</h2>
    <div class="project-grid">
      {#each projects as { title, description, imageUrl, link }}
        <a href={link} class="project-item" target="_blank">
          <img src={imageUrl} alt={title} />
          <div class="project-info">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
  
  <style>
    .projects {
      padding: 2rem;
    }
  
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
  
    .project-item {
      display: block;
      color: inherit;
      text-decoration: none;
    }
  
    .project-info {
      padding: 0.5rem;
    }
  
    h3 {
      color: #004d40;
    }
  
    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  </style>
  