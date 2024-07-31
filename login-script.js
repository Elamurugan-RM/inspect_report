document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();
    // Implement your authentication logic here
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For demonstration purposes, we'll assume any username/password combination is valid
    if (username && password) {
        // Redirect to the reports page
        window.location.href = 'index2.html';
    } else {
        alert('Invalid username or password');
    }
}
