
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
    startTimer.textContent = "Reset Timer"; 
    recordTime(); 

    sendProgressDataToBackend() 
  }
  else if (startTimer.textContent == "Reset Timer") {
    timerDisplay.textContent = "00:00:00"
    startTimer.textContent = "Start Timer"
  }
  else {
    startTimer.textContent = "Stop Timer";
    const startTime = new Date(); 

    intervalId = setInterval(() => {
      const currentTime = new Date(); 
      elapsedTime = currentTime - startTime; 

      // Convert elapsed time to hours, minutes, and seconds
      const totalSeconds = Math.floor(elapsedTime / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      timerDisplay.textContent = `${hours}H ${minutes}M ${seconds}S`;
    }, 1000);
  }
});


// PROGRESS CHART

let lectureTime = [];
let assignmentTime = [];
let otherTime = [];
let labels = [];

// To differentiate the activities
activity = document.getElementById("activities")

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
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      borderRadius: 5,  // Rounded edges
      hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',  // Hover effect
      hoverBorderColor: 'rgba(255, 99, 132, 1)',
      barThickness: 30, 
      order: 0
    }, {
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
    }, {
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
    elements: {
      bar: {
        borderRadius: 5,  // Rounded corners for all bars
        borderSkipped: false, 
      }
    }
  }
});

// Send Progress Data to Backend

async function sendProgressDataToBackend() {
  const classId = localStorage.getItem("selectedClass");

  labels.forEach((date, index) => {
    const activities = [
      { activityName: "Lecture", timeSpent: lectureTime[index] },
      { activityName: "Assignment", timeSpent: assignmentTime[index] },
      { activityName: "Other", timeSpent: otherTime[index] }
    ];

    activities.forEach(activity => {
      const data = {
        activityName: activity.activityName,
        date: new Date(date),
        timeSpent: activity.timeSpent,
        classId: classId
      };

      fetch('http://localhost:8000/api/saveActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

        .then(response => response.json())
        .then(result => {
          console.log('Activity saved successfully:', result);
        })

        .catch(error => {
          console.error('Error saving activity:', error);
        });
    });
  });
}

// Get data from backend
async function fetchActivities(classId) {
  try {
    const response = await fetch(`http://localhost:8000/api/getActivities?classId=${classId}`);
    const retrievedActivities = await response.json();

    if (!retrievedActivities || retrievedActivities.length === 0) {
      console.log("No activities found.");
      return;
    }

    // Reset arrays
    labels.length = 0;
    lectureTime.length = 0;
    assignmentTime.length = 0;
    otherTime.length = 0;

    // Process the retrieved data
    retrievedActivities.forEach(activity => {
      const date = new Date(activity.date).toLocaleDateString();

      if (!labels.includes(date)) {
        labels.push(date);
        lectureTime.push(activity.activityName === "Lecture" ? activity.timeSpent : 0);
        assignmentTime.push(activity.activityName === "Assignment" ? activity.timeSpent : 0);
        otherTime.push(activity.activityName === "Other" ? activity.timeSpent : 0);
      } else {
        const index = labels.indexOf(date);
        if (activity.activityName === "Lecture") lectureTime[index] += activity.timeSpent;
        if (activity.activityName === "Assignment") assignmentTime[index] += activity.timeSpent;
        if (activity.activityName === "Other") otherTime[index] += activity.timeSpent;
      }
    });

    updateChart();
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
}

// Fetch and update the chart
const classId = localStorage.getItem("selectedClass");
if (classId) {
  fetchActivities(classId);
}



// NOTES SECTION

document.addEventListener("DOMContentLoaded", () => {
  const submitNote = document.getElementById("note-btn");
  const noteDisplay = document.getElementById("notes-display");
  const noteValue = document.getElementById("notes-area");

  const classId = localStorage.getItem("selectedClass");
  console.log("Selected Class ID:", classId); // Debugging

  // Function to retrieve notes based on classId
  async function noteRetriever() {
    if (!classId) {
      console.error("No class selected!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/notes?classId=${classId}`);
      const retrievedNotes = await response.json();
      console.log("Retrieved Notes:", retrievedNotes); // Debugging

      noteDisplay.innerHTML = ""; // Clear existing notes before displaying new ones
      retrievedNotes.forEach(noteObj => {
        const note = document.createElement("div");
        note.textContent = noteObj.notes;
        noteDisplay.appendChild(note);
      });

    } catch (error) {
      console.error("Error fetching the notes!", error);
    }
  }

  window.onload = function () {
    console.log("Window fully loaded, calling noteRetriever..."); // Debugging
    noteRetriever();
  };

  // Adding notes to the database
  submitNote.addEventListener("click", async () => {
    const noteText = noteValue.value.trim();
    if (!noteText || !classId) {
      console.log("Note text or class ID missing!");
      return;
    }

    // Send note to backend with classId
    const response = await fetch("http://localhost:8000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: noteText,
        classId: classId // Send classId along with the note text
      })
    });

    console.log("Sending data to backend:", { notes: noteText, classId: classId }); // Debugging

    const result = await response.json();
    if (result.success) {
      const note = document.createElement("div");
      note.textContent = noteText;
      noteDisplay.appendChild(note);
    }

    noteValue.value = "";
  });
});




//REMINDERS SECTION

document.addEventListener("DOMContentLoaded", () => {
  const addReminderBtn = document.getElementById("add-reminder-btn");
  const reminderList = document.getElementById("reminder-list");

  const classId = localStorage.getItem("selectedClass");
  console.log("Selected Class ID:", classId); // Debugging

  // Function to retrieve reminders from the database
  async function reminderRetriever() {
    if (!classId) {
      console.error("No class selected!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/reminders?classId=${classId}`);
      const retrievedReminders = await response.json();

      console.log("Retrieved Reminders:", retrievedReminders); // Debugging

      reminderList.innerHTML = "";
      retrievedReminders.forEach(reminderObj => {
        const reminder = document.createElement("div");
        reminder.classList.add("reminder-item");
        reminder.textContent = `${reminderObj.reminderTitle} - ${new Date(reminderObj.date).toLocaleDateString()}`;
        reminderList.appendChild(reminder);
      });

    } catch (error) {
      console.error("Error fetching the reminders!", error);
    }
  }

  // Retrieve reminders when the page loads
  reminderRetriever();

  addReminderBtn.addEventListener("click", async () => {
    const title = document.getElementById("reminder-title").value;
    const date = document.getElementById("reminder-date").value;

    if (title && date) {
      try {
        const response = await fetch("http://localhost:8000/api/reminders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reminderTitle: title, date: date, classId: classId })
        });

        if (response.ok) {
          console.log('Reminder saved successfully');
          reminderRetriever(); // Refresh reminders after saving
        } else {
          console.log('Failed to save reminder:', response.statusText);
        }

      } catch (error) {
        console.error('Error sending reminder data:', error);
      }

      // Clear input fields
      document.getElementById("reminder-title").value = "";
      document.getElementById("reminder-date").value = "";

    } else {
      alert("Please enter both a title and a date.");
    }
  });
});



// DYNAMIC CLASS DETAILS

document.addEventListener("DOMContentLoaded", () => {
  const classId = localStorage.getItem("selectedClass");
  console.log("Retrieved Class ID:", classId); // Debugging

  const classTitle = document.getElementById("classTitle");

  if (classId) {
    classTitle.textContent = classId;
  }
  else {
    classTitle.textContent = "Unknown Class";
  }
})