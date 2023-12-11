function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch user data');
    })
    .then(userData => {
        const foundUser = userData.find(user => user.username === username && user.password === password);
        if (foundUser) {
            window.location.href = 'profile.html';
        } else {
            alert('incorrect username or password');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    const newUser = {
        username: username,
        email: email,
        password: password,
    };

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Error signing up');
    })
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch(error => {
        alert(error.message);
    });
}

function logout() {
    window.location.href = 'index.html';
}