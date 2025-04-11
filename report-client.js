
async function fetchReports() {
    try {
      const response = await fetch("http://localhost:3000/reports");
      if (response.ok) {
        const reports = await response.json();
        const reportsTableBody = document.querySelector("#reportsTable tbody");
        
        if (!reportsTableBody) return; // Exit if table doesn't exist on current page
        
        reportsTableBody.innerHTML = ""; // Clear existing rows
  
        reports.forEach((report) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.title}</td>
            <td>${report.description}</td>
            <td>${report.location || 'N/A'}</td>
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
  
  // Function to extract userId from JWT token stored in localStorage
function getUserIdFromToken() {
  const token = localStorage.getItem("userId"); // Assuming the JWT token is saved in localStorage under "userId"
  if (token) {
    const decoded = jwt_decode(token); // Decode the token using jwt-decode
    return decoded.userId; // Return the userId from the decoded token
  }
  return null; // If no token is found, return null
}

  // Call fetchReports on page load