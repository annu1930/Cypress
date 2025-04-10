const isSignedIn = false; // Replace with actual logic to check user authentication

  const reportLink = document.getElementById('report-link');
  reportLink.addEventListener('click', (event) => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not signed in
      event.preventDefault();
      window.location.href = 'register.html';
    } else {
      // Redirect to report page if signed in
      window.location.href = 'report.html';
    }
  });
  function initMap() {
    const toronto = { lat: 43.65107, lng: -79.347015 }; // Coordinates for Toronto
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: toronto,
    });

    // Add a draggable marker
    const marker = new google.maps.Marker({
      position: toronto,
      map: map,
      draggable: true,
      title: "Drag me to pinpoint the location",
    });

    // Update the location input field when the marker is dragged
    google.maps.event.addListener(marker, 'dragend', function () {
      const position = marker.getPosition();
      document.getElementById("problemLocation").value = `${position.lat()}, ${position.lng()}`;
    });
  }

  // Initialize the map
  window.onload = initMap;
  document.querySelectorAll('.btn-success').forEach(button => {
    button.addEventListener('click', () => {
      alert('Status updated to "In Progress"');
    });
  });

  document.querySelectorAll('.btn-secondary').forEach(button => {
    button.addEventListener('click', () => {
      alert('Status updated to "Resolved"');
    });
  });

  document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this report?')) {
        alert('Report deleted');
      }
    });
  });
  const reports = [
    { id: 1, title: "Pothole on Main Street", description: "Large pothole causing traffic issues.", location: "43.65107, -79.347015", status: "Pending" },
    { id: 2, title: "Broken Streetlight", description: "Streetlight not working near the park.", location: "43.6532, -79.3832", status: "In Progress" },
  ];

  // Function to render reports in the table
  function renderReports() {
    const reportsTableBody = document.querySelector("#reportsTable tbody");
    reportsTableBody.innerHTML = ""; // Clear existing rows

    reports.forEach(report => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${report.id}</td>
        <td>${report.title}</td>
        <td>${report.description}</td>
        <td>${report.location}</td>
        <td>${report.status}</td>
      `;
      reportsTableBody.appendChild(row);
    });
  }

  // Call renderReports on page load
  document.addEventListener("DOMContentLoaded", renderReports);

    // Validation for Sign In Form

  function validateSignInForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return false;
    }

    return true; // Allow form submission
  }
  // Handle Reset Form Submission
  function handleReset() {
    const email = document.getElementById('reset-email').value;

    if (!email) {
      alert('Please enter your registered email address.');
      return false;
    }

    alert('If the email is registered, a reset link will be sent to your email.');
    return true; // Allow form submission
  }

   // Handle Sign In
   async function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simulate backend authentication
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("userId", user.id); // Store user ID in localStorage
      window.location.href = "index.html"; // Redirect to index page
    } else {
      alert("Invalid credentials. Please try again.");
    }
  }

  // Handle Register
  async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    // Simulate backend registration
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("userId", user.id); // Store user ID in localStorage
      window.location.href = "index.html"; // Redirect to index page
    } else {
      alert("Registration failed. Please try again.");
    }
  }