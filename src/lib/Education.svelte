<script>
    const education = [
      {
        institution: 'University of Central Florida',
        degree: 'Bachelors of Science: Computer Engineering',
        graduationYear: 'May 2025'
      }
    ];
  </script>
  
  <section class="education">
    <h2>Education</h2>
    {#each education as { institution, degree, graduationYear }}
      <div class="edu-item">
        <h3>{institution}</h3>
        <p>{degree} - Class of {graduationYear}</p>
      </div>
    {/each}
  </section>
  
  <style>
    .education {
      padding: 2rem;
    }
  
    .edu-item {
      margin-bottom: 1rem;
    }
  
    h3 {
      color: #00796b;
    }
  </style>
  