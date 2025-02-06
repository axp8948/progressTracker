// // To display current time
// setInterval(() => {
//   const now = new Date();

//   let hours = now.getHours();
//   let minutes = now.getMinutes();
//   let seconds = now.getSeconds();

//   let displayTime = document.getElementById("time")


//   displayTime.innerHTML = hours + " : " + minutes + " : " + seconds;
// }, 1000)

// For the filp clock
function initializeClock() {
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  let previousTime = {
    hours: '',
    minutes: '',
    seconds: ''
  };

  function updateClock() {
    const currentTime = new Date();
    const currentHours = formatTime(currentTime.getHours());
    const currentMinutes = formatTime(currentTime.getMinutes());
    const currentSeconds = formatTime(currentTime.getSeconds());

    if (currentSeconds !== previousTime.seconds) {
      updateFlipCard(secondsElement, currentSeconds);
    }
    if (currentMinutes !== previousTime.minutes) {
      updateFlipCard(minutesElement, currentMinutes);
    }
    if (currentHours !== previousTime.hours) {
      updateFlipCard(hoursElement, currentHours);
    }

    previousTime = {
      hours: currentHours,
      minutes: currentMinutes,
      seconds: currentSeconds
    };
  }

  setInterval(updateClock, 1000);
  updateClock(); // Initialize the clock immediately
}

function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

function updateFlipCard(element, newValue) {
  const top = element.querySelector('.top');
  const bottom = element.querySelector('.bottom');
  const flip = element.querySelector('.flip');

  if (top.textContent !== newValue) {
    flip.textContent = newValue;
    bottom.textContent = top.textContent;
    top.textContent = newValue;

    flip.classList.remove('animate');
    void flip.offsetWidth; // Trigger reflow to restart animation
    flip.classList.add('animate');
  }
}

initializeClock();


// To Start the timer

let startTimer = document.getElementById("start-timer"); // button
let timerDisplay = document.getElementById("timer-display"); // time

let intervalId;
let elapsedTime = 0;

startTimer.addEventListener('click', () => {
  // To stop the timer
  if (startTimer.textContent == "Stop Timer") {
    clearInterval(intervalId);
    startTimer.textContent = "Reset Timer"; // Optionally, change the button text back to "Reset Timer"
    recordTime(); // call the recorTime to store the time that elapsed
  }
  else if (startTimer.textContent == "Reset Timer") {
    timerDisplay.textContent = "00:00:00"
    startTimer.textContent = "Start Timer"
  }
  else {
    startTimer.textContent = "Stop Timer";
    const startTime = new Date(); // Record the start time

    intervalId = setInterval(() => {
      const currentTime = new Date(); // Get the current time
      elapsedTime = currentTime - startTime; // Calculate elapsed time in milliseconds
      // console.log(elapsedTime);

      // Convert elapsed time to hours, minutes, and seconds
      const totalSeconds = Math.floor(elapsedTime / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // console.log(hours, minutes, seconds);
      timerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
});

// To display the data in graph 

let lectureTime = [];
let assignmentTime = [];
let otherTime = [];
let labels = [];

// To differentiate the activities
activity = document.getElementById("activities")

// Function to record the time
// Function to record the time
function recordTime() {
  const date = new Date().toLocaleDateString(); // To get today's date

  // Check if the date exists in labels
  if (!labels.includes(date)) {
    labels.push(date);

    // Push zeros for other activities to maintain parallel arrays
    lectureTime.push(activity.value == "lecture" ? elapsedTime / 1000 / 60 : 0);
    assignmentTime.push(activity.value == "assignment" ? elapsedTime / 1000 / 60 : 0);
    otherTime.push(activity.value == "other" ? elapsedTime / 1000 / 60 : 0);

  } else {
    const index = labels.indexOf(date);

    // Update the correct dataset for the activity
    if (activity.value == "lecture") {
      lectureTime[index] += elapsedTime / 1000 / 60;
    } else if (activity.value == "assignment") {
      assignmentTime[index] += elapsedTime / 1000 / 60;
    } else {
      otherTime[index] += elapsedTime / 1000 / 60;
    }
  }
  updateChart();
}

// Function to update the chart
function updateChart() {
  timeChart.data.labels = labels;

  // Update all datasets
  timeChart.data.datasets[0].data = lectureTime;
  timeChart.data.datasets[1].data = assignmentTime;
  timeChart.data.datasets[2].data = otherTime;

  timeChart.update();
}


const ctx = document.getElementById('time-chart').getContext('2d');
const timeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Lecture Time',
            data: lectureTime,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Use a gradient here
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            borderRadius: 5,  // Rounded edges
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',  // Hover effect
            hoverBorderColor: 'rgba(255, 99, 132, 1)',
            barThickness: 30, // Adjust thickness
            order: 0
        },{
            label: 'Assignment Time',
            data: assignmentTime,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 1)',
            barThickness: 30,
            order: 1
        },{
            label: 'Other Time',
            data: otherTime,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            borderRadius: 5,
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
            hoverBorderColor: 'rgba(75, 192, 192, 1)',
            barThickness: 30,
            order: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        // plugins: {
        //     tooltip: {
        //         callbacks: {
        //             label: function(context) {
        //                 return `${context.dataset.label}: ${context.raw} minutes`; // Custom tooltip
        //             }
        //         }
        //     }
        // },
        elements: {
            bar: {
                borderRadius: 5,  // Rounded corners for all bars
                borderSkipped: false,  // Remove the border skip for a cleaner look
            }
        }
    }
});





// NOTES SECTION

// To display notes:
document.addEventListener("DOMContentLoaded", () => {
  submitNote = document.getElementById("note-btn");
  noteDisplay = document.getElementById("notes-display");
  noteValue = document.getElementById("notes-area")

  submitNote.addEventListener("click", () => {
    
    const note = document.createElement("div");
    note.textContent = noteValue.value;

    noteDisplay.appendChild(note);

    
    document.getElementById("notes-area").value = "";
  })
  
})



// REMINDERS SECTION

document.addEventListener("DOMContentLoaded", () => {
    const addReminderBtn = document.getElementById("add-reminder-btn");
    const reminderList = document.getElementById("reminder-list");

    addReminderBtn.addEventListener("click", () => {
        const title = document.getElementById("reminder-title").value;
        const date = document.getElementById("reminder-date").value;

        if (title && date) {
            // Create a new reminder item
            const reminderItem = document.createElement("div");
            reminderItem.classList.add("reminder-item");
            reminderItem.textContent = `${title} - ${date}`;

            // Add the reminder to the list
            reminderList.appendChild(reminderItem);

            // Clear the input fields
            document.getElementById("reminder-title").value = "";
            document.getElementById("reminder-date").value = "";
        } else {
            alert("Please enter both a title and a date.");
        }
    });
});





