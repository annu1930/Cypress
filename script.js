const isSignedIn = false; // Replace with actual logic to check user authentication

  const reportLink = document.getElementById('report-link');
  reportLink.addEventListener('click', (event) => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not signed in
      event.preventDefault();
      window.location.href = 'login.html';
    } else {
      // Redirect to report page if signed in
      window.location.href = 'report.html';
    }
  });