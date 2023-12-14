// checks if user has registered before, if yes allows user to login
let u = '';
let p = '';
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
            localStorage.setItem('u', username);
            localStorage.setItem('p', password);
            window.location.href = 'profile.html';        
        } else {
            alert('incorrect username or password');
        }
    })
    .catch(error => {
        console.error('Error while login:', error);
        alert(error);
    });
}

// register a new user
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
        console.error('Error signing up:', error);
        alert(error);
    });
}

// logout
function logout() {
    window.location.href = 'index.html';
}

// gets tasks from mockAPI shows it on profile.html
function getTasks(username, password){    
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            tasks.appendChild(li);
            let img = document.createElement('img');
            img.src = './images/edit26.png';
            img.setAttribute('tabindex', '-1');
            li.appendChild(img);
            let p = document.createElement('p');
            p.setAttribute('tabindex', '-1');
            p.innerHTML = '\u00d7';
            li.appendChild(p);
            if (data[i].done) {
                li.classList.add('done');
            }
        }
    })
    .catch(error => {
        console.error('Error getting tasks:', error);
        alert(error);
    });
}

// calls function getTasks() when DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks(localStorage.getItem('u'), localStorage.getItem('p'));
});

// add tasks to mockAPI and to profile
function addTask(username, password){
    const taskInput = document.getElementById('task');
    const task = taskInput.value;
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    const newTask = {
        task: task,
        done: false
    };
    if (task != ''){
        fetch(url)
        .then(response => {
            if (response.ok) {
                
                return response.json();
            }
            throw new Error('Failed to fetch userInfo');
        })
        .then((userId) => {
            const user = userId.find(user => user.username === username && user.password === password);
            if (user) {
                const id = user.id;
                return fetch(`${url}/${id}/task`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newTask)
                });
            } 
            else {
                throw new Error('User id not found');
            }
        })
        .then(response => {
            if (response.ok) {            
                return response.json();
            }
            throw new Error('Error adding task');
        })
        .then(() => {
            if(task==='')
                alert('it is empty');
            else {        
                let li = document.createElement('li');
                li.textContent = task;
                li.setAttribute('contenteditable', 'false');
                tasks.appendChild(li);
                let img = document.createElement('img');
                img.src = './images/edit26.png';
                img.setAttribute('tabindex', '-1');
                li.appendChild(img);
                let p = document.createElement('p');
                p.innerHTML = '\u00d7';
                p.setAttribute('tabindex', '-1');
                li.appendChild(p);
            }
            taskInput.value = '';
            saveTasks();
        })
        .catch(error => {
            console.error('Error adding task:', error);
            alert(error);
        });       
    }
    else {
        alert('It is empty');
    }
}

// delete tasks from mockAPI
function deleteTask(taskTitle, username, password) {
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    fetch(url)
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } 
        else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch task');
    })
    .then(data => {
        const taskDelete = data.find(task => task.task === taskTitle);
        if (taskDelete) {
            const tid = taskDelete.id;
            const uid = taskDelete.userInfoId;
            return fetch(`${url}/${uid}/task/${tid}`, {
                method: 'DELETE'
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        alert(error);
    });
}

// updates task on mockAPI
function update(taskTitle, newInput, username, password) {   
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    fetch(url)
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } 
        else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch task');
    })
    .then(data => {
        const getTask = data.find(task => task.task === taskTitle);
        if (getTask) {
            const tid = getTask.id;
            const uid = getTask.userInfoId;
            return fetch(`${url}/${uid}/task/${tid}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task: newInput })
            });
        } else {
            throw new Error('Task not found');
        }
    })    
    .catch(error => {
        console.error('Error updating task:', error);
        alert(error);
    });
    saveTasks();
}

// marks task as done on mockAPI
function done(taskTitle, username, password){
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    fetch(url)
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } 
        else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Failed to fetch task');
    })
    .then(data => {
        const taskDone = data.find(task => task.task === taskTitle);
        let isDone = false;
        if(taskDone.done === false)
            isDone = true;

        if (taskDone) {
            const tid = taskDone.id;
            const uid = taskDone.userInfoId;
            return fetch(`${url}/${uid}/task/${tid}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ done: isDone })
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        console.error('Error while marking task done:', error);
        alert(error);
    });
}

// marks done, deletes, updates on profile.html
let oldTitle = '';
tasks.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI' && e.target.getAttribute('contenteditable') === 'false'){
        const taskTitle = e.target.textContent.slice(0, -1);
        e.target.classList.toggle('done');
        done(taskTitle, localStorage.getItem('u'), localStorage.getItem('p'));
        saveTasks();
    }
    else if(e.target.tagName === 'P'){
        const taskTitle = e.target.parentElement.textContent.slice(0, -1);
        e.target.parentElement.remove();
        deleteTask(taskTitle, localStorage.getItem('u'), localStorage.getItem('p'));
        saveTasks();
    }
    else if (e.target.tagName === 'IMG'){
        const taskTitle = e.target.parentElement.textContent.slice(0, -1);
        if (oldTitle === '') {
            oldTitle = taskTitle;
        }
        const text = e.target.parentElement;
        if(e.target.src.includes('edit')){
            e.target.src='./images/save26.png';
            text.contentEditable = true;        
            text.focus();
        }
        else if(e.target.src.includes('save')){
            e.target.src='./images/edit26.png';
            text.contentEditable = false;
            text.blur();
            let newInput = text.firstChild.textContent.trim();
            update(oldTitle, newInput, localStorage.getItem('u'), localStorage.getItem('p'));
        }       
        saveTasks();
    }
});

// shows all tasks in profile.html
function all() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks(localStorage.getItem('u'), localStorage.getItem('p'));
}
// calls function all() when tag with class .all is clicked
document.querySelector('.all').addEventListener('click', all);

// shows active tasks in profile.html
function active(username, password) {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            if (data[i].done === false) {
                tasks.appendChild(li);
                let img = document.createElement('img');
                img.src = './images/edit26.png';
                img.setAttribute('tabindex', '-1');
                li.appendChild(img);
                let p = document.createElement('p');
                p.setAttribute('tabindex', '-1');
                p.innerHTML = '\u00d7';
                li.appendChild(p);
            }
        }
    })
    .catch(error => {
        console.error('Error getting active tasks:', error);
        alert(error);
    });
}

// shows completed tasks in profile.html
function completed(username, password) {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/userInfo';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch userInfo');
    })
    .then((userId) => {
        const user = userId.find(user => user.username === username && user.password === password);
        if (user) {
            const id = user.id;
            return fetch(`${url}/${id}/task`);
        } else {
            throw new Error('User id not found');
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            if (data[i].done === true) {
                tasks.appendChild(li);
                let img = document.createElement('img');
                img.src = './images/edit26.png';
                img.setAttribute('tabindex', '-1');
                li.appendChild(img);
                let p = document.createElement('p');
                p.setAttribute('tabindex', '-1');
                p.innerHTML = '\u00d7';
                li.appendChild(p);
                li.classList.add('done');
            }
        }
    })
    .catch(error => {
        console.error('Error getting completed tasks:', error);
        alert(error);
    });
}

// saves tasks to localStorage
function saveTasks(){
    localStorage.setItem('tasks', tasks.innerHTML);
}

// function to show tasks from localStorage
function showTasks(){
    tasks.innerHTML = localStorage.getItem('tasks');
}
// calls function showTasks()
showTasks();

const username = localStorage.getItem('u');
document.getElementById('user').textContent = username;