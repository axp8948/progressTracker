// Function to display random Jokes
async function myFunction() {
  try {
      // Fetch the joke from the API
      const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
      const randomJokes = await response.json();

      // Get the element where the joke will be displayed
      let jokesElement = document.getElementById("jokes");
      let showPunchlineButton = document.getElementById("show-punchline");

      // Create and append the punchline element
      let punchlineElement = document.createElement('div');
      punchlineElement.id = 'punchline';
      punchlineElement.textContent = randomJokes.punchline;
      jokesElement.innerHTML = randomJokes.setup;
      jokesElement.appendChild(punchlineElement);

      // Event listener for the button to toggle punchline
      showPunchlineButton.addEventListener('click', function() {
          // Toggle the punchline visibility
          if (punchlineElement.style.display === 'none') {
              punchlineElement.style.display = 'block';
              showPunchlineButton.textContent = 'Hide Punchline';
          } else {
              punchlineElement.style.display = 'none';
              showPunchlineButton.textContent = 'Show Punchline';
          }
      });

  } catch (error) {
      console.error("Error fetching the joke:", error);
  }
}

// Ensure the function is called once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', myFunction);


// TRACKER 
// Mental tracker 

// to redirect the user 
function redirectToMentalTracker() 
{
    window.location.href = "mentaltracker.html";
}