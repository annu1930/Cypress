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
    const defaultLocation = { lat: 43.65107, lng: -79.347015 }; // Default location (e.g., Toronto)
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: defaultLocation,
    });
  
    // Add a draggable marker
    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      title: "Drag me to pinpoint the location",
    });
  
    // Update the location input field when the marker is dragged
    google.maps.event.addListener(marker, "dragend", function () {
      const position = marker.getPosition();
      document.getElementById("problemLocation").value = `${position.lat()}, ${position.lng()}`;
    });
  }

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

  const userReports = JSON.parse(localStorage.getItem("userReports")) || [];
  userReports.forEach(report => {
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

async function fetchReports() {
  try {
    const response = await fetch("http://localhost:3000/reports");
    if (response.ok) {
      const reports = await response.json();
      const reportsTableBody = document.querySelector("#reportsTable tbody");
      reportsTableBody.innerHTML = ""; // Clear existing rows

      reports.forEach((report) => {
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
    } else {
      alert("Failed to fetch reports.");
    }
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
}

// Call fetchReports on page load

document.addEventListener("DOMContentLoaded", fetchReports);
 
//handle sign in
async function handleSignIn(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Login successful!");
      localStorage.setItem("userId", data.token); // Store token
      window.location.href = "index.html"; // Redirect to main page
    } else {
      alert("Invalid credentials. Please try again.");
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    alert("An error occurred. Please try again.");
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Account created successfully! Please sign in.");
      // Optionally, switch to the Sign In tab
      document.getElementById("sign-in-tab").click();
    } else if (response.status === 409) {
      alert("Email already registered. Please sign in.");
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred. Please try again.");
  }
}