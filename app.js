const addGoalBtn = document.getElementById("addGoalBtn");
const goalFormContainer = document.getElementById("goalFormContainer");
const cancelBtn = document.getElementById("cancelBtn");
const goalForm = document.getElementById("goalForm");
const goalList = document.getElementById("goalList");
const categorySelect = document.getElementById("category");
const customCategoryInput = document.getElementById("customCategory");
const customCategoryLabel = document.getElementById("customCategoryLabel");

let goals = JSON.parse(localStorage.getItem("goals")) || [];


goalFormContainer.classList.add("hidden");


addGoalBtn.addEventListener("click", () => {
  goalFormContainer.classList.remove("hidden");  // Show the form
});


cancelBtn.addEventListener("click", () => {
  goalFormContainer.classList.add("hidden");  // Hide the form
});


categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "Other") {
    customCategoryInput.classList.remove("hidden");
    customCategoryLabel.classList.remove("hidden");
  } else {
    customCategoryInput.classList.add("hidden");
    customCategoryLabel.classList.add("hidden");
  }
});


goalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const goalName = document.getElementById("goalName").value;
  const category = categorySelect.value === "Other" ? customCategoryInput.value : categorySelect.value;
  const priority = document.getElementById("priority").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const progress = document.getElementById("progress").value;

  if (category === "" || (category === "Other" && !customCategoryInput.value)) {
    alert("Please provide a valid category.");
    return;
  }

  const newGoal = { goalName, category, priority, startDate, endDate, progress };
  goals.push(newGoal);
  localStorage.setItem("goals", JSON.stringify(goals)); // Save to localStorage

  renderGoals();
  updateCharts();
  goalForm.reset();
  goalFormContainer.classList.add("hidden");  // Hide the form
});


function renderGoals() {
  goalList.innerHTML = "";
  let totalGoals = 0;
  let activeGoals = 0;
  let finishedGoals = 0;

  goals.forEach((goal, index) => {
    totalGoals++;
    if (goal.progress < 100) {
      activeGoals++;
    } else {
      finishedGoals++;
    }

    const goalCard = document.createElement("div");
    goalCard.classList.add("goal-card", goal.priority);
    goalCard.innerHTML = `
      <h3>${goal.goalName}</h3>
      <p><strong>Category:</strong> ${goal.category}</p>
      <p><strong>Start:</strong> ${goal.startDate}</p>
      <p><strong>End:</strong> ${goal.endDate}</p>
      <p><strong>Progress:</strong> ${goal.progress}%</p>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${goal.progress}%"></div>
      </div>
      <div>
        <label for="updateProgress${index}">Update Progress:</label>
        <input type="number" id="updateProgress${index}" min="0" max="100">
        <button onclick="updateProgress(${index})">Update</button>
      </div>
      <button onclick="deleteGoal(${index})">Delete</button>
    `;
    goalList.appendChild(goalCard);
  });

  // Update goal stats
  document.getElementById("totalGoals").textContent = totalGoals;
  document.getElementById("activeGoals").textContent = activeGoals;
  document.getElementById("finishedGoals").textContent = finishedGoals;
}

// Update the progress of a goal
function updateProgress(index) {
  const progressInput = document.getElementById(`updateProgress${index}`);
  const newProgress = parseInt(progressInput.value);

  if (newProgress >= 0 && newProgress <= 100) {
    goals[index].progress = newProgress;
    localStorage.setItem("goals", JSON.stringify(goals)); 
    renderGoals();
    updateCharts();
  }
}

// Delete a goal
function deleteGoal(index) {
  goals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(goals)); 
  renderGoals();
  updateCharts();
}


function updateCharts() {
  const categoryCounts = {
    Personal: 0,
    Work: 0,
    Health: 0,
    Hobby: 0
  };

  const progressData = goals.map(goal => goal.progress);
  
  goals.forEach(goal => {
    categoryCounts[goal.category] = (categoryCounts[goal.category] || 0) + 1;
  });


  categoryChart.data.datasets[0].data = Object.values(categoryCounts);
  categoryChart.update();


  const progressSum = progressData.reduce((a, b) => a + b, 0);
  const averageProgress = progressData.length ? progressSum / progressData.length : 0;
  progressChart.data.datasets[0].data = [averageProgress];
  progressChart.update();
}

// Create charts for statistics
const categoryChart = new Chart(document.getElementById('goalCategoryChart'), {
  type: 'pie',
  data: {
    labels: ['Personal', 'Work', 'Health', 'Hobby'],
    datasets: [{
      label: 'Goals by Category',
      data: [0, 0, 0, 0],  // This will be updated dynamically
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} Goals`;
          }
        }
      }
    }
  }
});

const progressChart = new Chart(document.getElementById('goalProgressChart'), {
  type: 'bar',
  data: {
    labels: ['Average Progress'],
    datasets: [{
      label: 'Average Progress (%)',
      data: [0],  
      backgroundColor: '#36A2EB',
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    },
  }
});

// Initial rendering
renderGoals();
updateCharts();
