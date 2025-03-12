async function myFunction() {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
        const randomJokes = await response.json();

        let jokesElement = document.getElementById("jokes");
        let punchlineElement = document.getElementById("punchline");

        // If punchline div doesn't exist, create it
        if (!punchlineElement) {
            punchlineElement = document.createElement('div');
            punchlineElement.id = 'punchline';
            punchlineElement.style.display = 'none';
            jokesElement.appendChild(punchlineElement);
        }

        jokesElement.innerHTML = randomJokes.setup; // Set the joke setup
        jokesElement.appendChild(punchlineElement); // Reattach punchline after setup
        punchlineElement.textContent = randomJokes.punchline; // Set the punchline
        punchlineElement.style.display = 'none'; // To hide initially
    } catch (error) {
        console.error("Error fetching the joke:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    myFunction(); // Fetch the first joke on page load

    const showPunchlineButton = document.getElementById("show-punchline");
    showPunchlineButton.addEventListener('click', function() {
        let punchlineElement = document.getElementById("punchline");

        if (punchlineElement.style.display === 'none') {
            punchlineElement.style.display = 'block';
            showPunchlineButton.textContent = 'Hide Punchline';
        } else {
            punchlineElement.style.display = 'none';
            showPunchlineButton.textContent = 'Show Punchline';
        }
    });
});


// TRACKER 
// Mental tracker 

// to redirect the user 
function redirectToMentalTracker() 
{
    window.location.href = "mentaltracker.html";
}