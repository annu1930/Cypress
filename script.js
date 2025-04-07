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