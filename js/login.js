document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        alert('Login successful!');
        // Redirect or perform further actions
        // log_in();
        window.location.href = '/html/tong_quan.html'; 
    } else {
        document.getElementById('message').textContent = 'Sai username hoặc mật khẩu';
    }
});
