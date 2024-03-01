fetch('http://localhost:3000/api/user', {
    credentials: 'include', // Include credentials to send the session cookie
})
.then(response => {
  return response.json()
})
.then(data => {
    console.log('the data',data); // This will be the user's information
    let welcomeElement = document.getElementsByClassName('Welcome')[0];
    if (welcomeElement) {
        welcomeElement.innerText = 'Welcome, ' + data.firstName + '!';
    }
})
.catch((error) => {
    console.error('Error:', error);
});


// Onboarding form submission
document.getElementById('onboardingForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log('Form data:', formData);

    fetch('http://localhost:3000/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data)
    window.location.href = '/dashboard'
  })
  .catch((error) => console.error('Error:', error));
});


// Logout functionality



//buttons
document.getElementById('profile').addEventListener('click', function() {
  // Make a request to your Google login route when the button is clicked
  window.location.href = 'http://localhost:5000/profile';
});

document.getElementById('mentor').addEventListener('click', function() {
  // Make a request to your Google login route when the button is clicked
  window.location.href = 'http://localhost:5000/mentors';
});

document.getElementById('connections').addEventListener('click', function() {
  // Make a request to your Google login route when the button is clicked
  window.location.href = 'http://localhost:5000/connections';
});

document.getElementById('dashboard').addEventListener('click', function() {
  // Make a request to your Google login route when the button is clicked
  window.location.href = 'http://localhost:5000/dashboard';
});
document.getElementById('events').addEventListener('click', function() {
  // Make a request to your Google login route when the button is clicked
  window.location.href = 'http://localhost:5000/events';
});