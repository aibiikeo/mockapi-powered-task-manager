// gets tasks from mockAPI shows it on profile.html
function getTasks(){    
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    return fetch(url)
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
        alert(error.message);
    });
}

// calls function getTasks() when DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks();
});

// checks if user has registered before, if yes allows user to login
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
        console.log(foundUser);
        if (foundUser) {
            window.location.href = 'profile.html';        
        } else {
            alert('incorrect username or password');
        }
    })
    .catch(error => {
        alert("cvvvvvvvvvvv", error.message);
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
        alert(error.message);
    });
}

// logout
function logout() {
    window.location.href = 'index.html';
}

// add tasks to mockAPI and to profile
function addTask(){
    const taskInput = document.getElementById('task');
    const task = taskInput.value;
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    const newTask = {
        task: task,
        done: false
    };
    if (task != ''){
        console.log('aaaaaaaaaa')
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTask)
        })
        .then(response => {
            if (response.ok) {            
                return response.json();
            }
            throw new Error('Error adding task');
        })
        .catch(error => {
            alert(error.message);
        });
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
    }
    else {
        alert('It is empty');
    }
}

// delete tasks from mockAPI
function deleteTask(taskTitle) {
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        const taskDelete = data.find(task => task.task === taskTitle);
        if (taskDelete) {
            const id = taskDelete.id;
            return fetch(`${url}/${id}`, {
                method: 'DELETE'
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// marks task as done on mockAPI
function done(taskTitle){
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error marking task done');
    })
    .then(data => {
        const taskDone = data.find(task => task.task === taskTitle);
        let isDone = false;
        if(taskDone.done === false)
            isDone = true;

        if (taskDone) {
            const id = taskDone.id;
            return fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ done: isDone })
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        alert(error);
    });
}

// updates task on mockAPI
function update(taskTitle, newInput) {   
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error updating task');
    })
    .then(data => {
        const getTask = data.find(task => task.task === taskTitle);        

        if (getTask) {
            const id = getTask.id;
            return fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task: newInput })
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        alert(error);
    });
    saveTasks();
}

// marks done, deletes, updates on profile.html
let oldTitle = '';
tasks.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI' && e.target.getAttribute('contenteditable') === 'false'){
        const taskTitle = e.target.textContent.slice(0, -1);
        e.target.classList.toggle('done');
        done(taskTitle);
        saveTasks();
    }
    else if(e.target.tagName === 'P'){
        const taskTitle = e.target.parentElement.textContent.slice(0, -1);
        e.target.parentElement.remove();
        deleteTask(taskTitle);
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
            update(oldTitle, newInput);
        }       
        saveTasks();
    }
});

// shows all tasks in profile.html
function all() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks();
}
// calls function all() when tag with class .all is clicked
document.querySelector('.all').addEventListener('click', all);

// shows active tasks in profile.html
function active() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    return fetch(url)
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
        alert(error.message);
    });
}

// shows completed tasks in profile.html
function completed() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caea64fcff8d730f1107.mockapi.io/api/v1/task';
    return fetch(url)
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
        alert(error.message);
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