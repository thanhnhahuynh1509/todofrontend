var username = sessionStorage.getItem('username');
var password = sessionStorage.getItem('password');

if(username) {

} else {
    window.location.replace("index.html");
}

var workSpaceId = 0;

const url = `https://api-todos-example.herokuapp.com/api`;

function start() {
    
    handleAddBtn(url);

    getWorkSpaces(url).then((workspaces) => {
        renderWorkSpaces(workspaces);
    })

};


start();

// WORK SPACES

function handleAddBtn(url) {
    let addBtn = document.querySelector('.btn-add-workspaces');
    
    addBtn.onclick = () => {
        addWorkSpace(url)
        .then((workSpace) => {
            let id = workSpace.workSpaceId;
            let work = `
                <div class="work${id} work-css">
                    <input class="inp${id}" type="text" name="name" autocomplete="off" value="${workSpace.name}" onchange="updateWorkSpace(${id})">
                    <button class="btn-delete-workspaces" onclick="deleteWS(${id})">
                        <i class="fas fa-trash icon-delete hover-btn"></i>
                    </button>
                    <button class="btn-redirect-todo" onclick = "redirect(${id})">
                        <i class="fas fa-arrow-right icon-redirect hover-btn"></i>
                    </button>
                </div>
            `
                let contentWork = document.querySelector('.content-work');
                contentWork.innerHTML += work;
            })
    }


}

function addMapping(endPoint, data) {
    let header = new Headers({
        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        'Content-Type': 'application/json',
    });

    let optional = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data)
    }

    return fetch(url + endPoint, optional)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

function getMapping(endPoint) {
    let header = new Headers({
        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        'Content-Type': 'application/json',
    });

    let optional = {
        method: 'GET',
        headers: header,
    }
    return fetch(url + endPoint, optional).then((response) => response.json()).catch((error) => error);
}

function updateMapping(endPoint, data) {
    let header = new Headers({
        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        'Content-Type': 'application/json'
    });

    let optional = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data)
    }

    return fetch(url + endPoint, optional).then().catch((error) => error);
}

function deleteMapping(endPoint) {

    let header = new Headers({
        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        'Content-Type': 'application/json',
    });

    let optional = {
        method: 'DELETE',
        headers: header,
    }

    return fetch(url + endPoint, optional).then().catch((error) => error);
}


function addWorkSpace(url) {
    let endPoint = `/workspaces`;

    let data = {
        name: ''
    }

    return addMapping(endPoint, data);
}



async function getWorkSpaces(url) {

    let endPoint = `/workspaces`;
    return getMapping(endPoint);
}

function renderWorkSpaces(workSpaces) {
    let contentWork = document.querySelector('.content-work');

    let works = workSpaces.map((workSpace) => {
        let id = workSpace.workSpaceId;
        return `
        <div class="work${id} work-css">
            <input class="inp${id}" type="text" name="name" autocomplete="off" value="${workSpace.name}" onchange="updateWorkSpace(${id})">
            <button class="btn-delete-workspaces" onclick="deleteWS(${id})">
                <i class="fas fa-trash icon-delete hover-btn"></i>
            </button>
            <button class="btn-redirect-todo" onclick = "redirect(${id})">
                <i class="fas fa-arrow-right icon-redirect hover-btn"></i>
            </button>
        </div>
        `;
    });

    contentWork.innerHTML += works.join(" ");
}


function deleteWS(wsId) {

    let endPoint = `/workspaces/${wsId}`
    let work = document.querySelector(`.work${wsId}`);

    deleteMapping(endPoint);

    work.remove();

    let mainTodo = document.querySelector(`.main-todo`);
    mainTodo.classList.add('hide')
}


function updateWorkSpace(id) {
    let input = document.querySelector(`.inp${id}`);
    let value = input.value;

    let endPoint = `/workspaces/${id}`;

    let data = {
        name: value
    }

    input.setAttribute('value', value);
    
    updateMapping(endPoint, data);
    
}

// TOsDOS

function redirect(id) {
    workSpaceId = id;
    let mainTodo = document.querySelector(`.main-todo`);
    let taskName = document.querySelector(`.task-name`);
    let work = document.querySelector(`.work${id}`);
    let value = work.querySelector(`input[name="name"]`).value;

    taskName.innerHTML = `Task: ${value}`;
    

    mainTodo.classList.remove('hide')

    getTodos(id).then((todos) => {
        renderTodo(todos);
    })
}

function renderTodo(todos) {
    let containTodo = document.querySelector('.content-todos');

    containTodo.innerHTML = '';

    let todoRender = todos.map((todo) => {
        let id = todo.todoId;
        let checked = '';
        let cssThoughLine = '';

        if(todo.status) {
            checked = 'checked'
            cssThoughLine = 'text-transform-todo'
        } else {
            checked = '';
            cssThoughLine = '';
        }

        return `
        <div class="todo todo${id}">
            <input type="checkbox" ${checked} onclick="updateTodo(${id})">
            <input class="todoInp${id} ${cssThoughLine}" type="text" name="todo" autocomplete="off" value="${todo.content}" onchange="updateTodo(${id})">
            <button class="btn-delete-todo" onclick = "deleteTodo(${id})">DEL</button>
        </div>
        `;
    });

    containTodo.innerHTML += todoRender.join(" ");
}

function getTodos(id) {
    let endPoint = `/todos/workspaces/${id}`;
    return getMapping(endPoint);
}

function addTodos() {
    let endPoint = `/todos/workspaces/${workSpaceId}`;

    let data = {
        content: '',
        status: false
    }

    addMapping(endPoint, data)
        .then((todo) => {
            let id = todo.todoId;
            let todoRender = `
            <div class="todo todo${id}">
                <input type="checkbox" onclick="updateTodo(${id})">
                <input class="todoInp${id}" type="text" name="todo" autocomplete="off" value="${todo.content}"  onchange="updateTodo(${id})">
                <button class="btn-delete-todo" onclick = "deleteTodo(${id})">DEL</button>
            </div>
            `
            let contentTodos = document.querySelector('.content-todos');
            contentTodos.innerHTML += todoRender;
        });
}

function deleteTodo(id) {
    let endPoint = `/todos/${id}`

    let todoRemove = document.querySelector(`.todo${id}`)

    todoRemove.remove();

    deleteMapping(endPoint);
}

function updateTodo(id) {

    let endPoint = `/todos/${id}`;
    let todo = document.querySelector(`.todo${id}`);
    let todoInput = document.querySelector(`.todoInp${id}`);
    let status = todo.querySelector(`input[type="checkbox"]`).checked;
    let value = todoInput.value;
    let data = {
        content: value,
        status: status
    }

    let cssThoughLine = 'text-transform-todo';

    if(status) {
        todoInput.classList.add(`${cssThoughLine}`);
        todo.querySelector(`input[type="checkbox"]`).setAttribute('checked', true);
    } else {
        todoInput.classList.remove(`${cssThoughLine}`);
    }

    todoInput.setAttribute('value', todoInput.value);

    updateMapping(endPoint, data);
}



