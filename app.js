// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const goalFormContainer = document.getElementById("goalFormContainer");
  const cancelBtn = document.getElementById("cancelBtn");
  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");
  const addGoalBtn = document.getElementById("addGoalBtn");
  const dashboard = document.getElementById("dashboard");
  const registerPage = document.getElementById("registerPage");
  const loginPage = document.getElementById("loginPage");
  
  let goals = [];
  
  // User Registration
  function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Registration successful');
        showDashboard();
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(`Error: ${errorMessage}`);
      });
  }
  
  // User Login
  function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Login successful');
        showDashboard();
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(`Error: ${errorMessage}`);
      });
  }
  
  // Show Registration Page
  function showRegisterPage() {
    registerPage.style.display = 'block';
    loginPage.style.display = 'none';
  }
  
  // Show Login Page
  function showLoginPage() {
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
  }
  
  // Show Dashboard
  function showDashboard() {
    registerPage.style.display = 'none';
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
  }
  
  // Show Authentication Pages
  function showAuthPages() {
    registerPage.style.display = 'none';
    loginPage.style.display = 'none';
    dashboard.style.display = 'none';
    registerPage.style.display = 'block';
  }
  
  // Monitor Authentication State
  auth.onAuthStateChanged((user) => {
    if (user) {
      showDashboard();
    } else {
      showAuthPages();
    }
  });
  
  // Open the Add Goal Form
  addGoalBtn.addEventListener("click", () => {
    goalFormContainer.classList.remove("hidden");
  });
  
  // Close the Add Goal Form
  cancelBtn.addEventListener("click", () => {
    goalFormContainer.classList.add("hidden");
  });
  
  // Handle Form Submission (Add Goal)
  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const goalName = document.getElementById("goalName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
  
    const newGoal = { goalName, startDate, endDate };
    goals.push(newGoal);
  
    renderGoals();
    goalForm.reset();
    goalFormContainer.classList.add("hidden");
  });
  
  // Render Goals
  function renderGoals() {
    goalList.innerHTML = "";
    goals.forEach((goal, index) => {
      const goalCard = document.createElement("div");
      goalCard.classList.add("goal-card");
      goalCard.innerHTML = `
        <h3>${goal.goalName}</h3>
        <p><strong>Start:</strong> ${goal.startDate}</p>
        <p><strong>End:</strong> ${goal.endDate}</p>
        <button onclick="deleteGoal(${index})">Delete</button>
        <button onclick="updateProgress(${index})">Update Progress</button>
        <input type="range" id="progressBar${index}" min="0" max="100" value="0">
        <p>Progress: <span id="progressLabel${index}">0%</span></p>
      `;
      goalList.appendChild(goalCard);
    });
  }
  
  // Delete Goal
  function deleteGoal(index) {
    goals.splice(index, 1);
    renderGoals();
  }
  
  // Update Goal Progress
  function updateProgress(index) {
    const progressBar = document.getElementById(`progressBar${index}`);
    const progressLabel = document.getElementById(`progressLabel${index}`);
    const progress = progressBar.value;
    progressLabel.textContent = `${progress}%`;
  }
  