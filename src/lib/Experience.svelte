<script>
    let openExperienceId = null;
  
    const experiences = [
      {
        id: 1,
        title: 'Software Engineer',
        company: 'RGS Healthcare, Miami, FL',
        period: 'December 2022 - Present',
        details: [
          'Engineered and implemented robust web scraping scripts.',
          'Architected a comprehensive relational database.',
          'Designed and executed sophisticated algorithms for email delivery.'
        ]
      },
      // Add other experiences similarly
    ];
  
    function toggleDetails(id) {
      openExperienceId = openExperienceId === id ? null : id;
    }
  </script>
  
  <section class="experience">
    <h2>Experience</h2>
    {#each experiences as { id, title, company, period, details }}
      <div class="exp-item" on:click={() => toggleDetails(id)}>
        <h3>{title} - {company}</h3>
        <p>{period}</p>
        {#if openExperienceId === id}
          <ul>
            {#each details as detail}
              <li>{detail}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </section>
  
  <style>
    .experience {
      padding: 2rem;
    }
  
    .exp-item {
      cursor: pointer;
      margin-bottom: 1rem;
      transition: background-color 0.3s ease;
    }
  
    .exp-item:hover {
      background-color: #e0f2f1;
    }
  
    h3 {
      color: #00695c;
    }
  </style>
  