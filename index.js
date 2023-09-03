const todos = document.querySelector('.todos');
const input = document.querySelector("input");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const left = document.getElementById("left");
const clear = document.getElementById("clear");
const toggle = document.querySelector(".toggle");


drawTodos();


function drawTodo(todo) {
    const cont = document.createElement("div");
    const check = document.createElement("div");
    const p = document.createElement("p");
    const btn = document.createElement("button");
    const img = document.createElement("img");
    const layer = document.createElement("div");
    layer.classList.add("layer");

    cont.setAttribute("draggable", "true");
    img.setAttribute("src", "images/icon-cross.svg");
    cont.className = `todo rm-r${todo.completed ? " completed" : ""}`;
    check.className = `check${todo.completed ? " checked" : ""}`;
    btn.className = "del";
    btn.append(img);
    p.innerText = todo.content;
    p.style.flex = "1";
    btn.addEventListener('click', () => {
        cont.remove();
        updateStroge(todo, true);
    });
    cont.addEventListener('dragstart', () => {
        cont.classList.add("dragged");
    });
    cont.addEventListener('dragend', () => {
        cont.classList.remove("dragged");
    });
    check.addEventListener('click', () => {
        if (check.classList.contains("checked")) return;
        
        todo.completed = true;
        updateStroge(todo, false);
        check.classList.add("checked");
        cont.classList.add("completed");
        check.append(layer)
    });
    if (todo.completed) check.append(layer);

    cont.append(check);
    cont.append(p);
    cont.append(btn);

    return cont;
}

function drawTodos(condition) {
    let Todos = JSON.parse(localStorage.getItem("todos"));

    todos.innerHTML = "";

    for (let content in Todos) {
        let todo = {content, completed: Todos[content]};

        if (condition === 'active') {
            if (Todos[content]) continue;
        } else if (condition === 'completed') {
            if (!Todos[content]) continue;
        }  

        todos.append(drawTodo(todo));
    }


    if (todos.innerHTML === "") {
        if (condition === 'active') {
            todos.innerHTML += noActives;
        } else if (condition === 'completed') {
            todos.innerHTML += noCompleted;
        } else todos.innerHTML += nothingTodo;
    }

    setLeft();
}

function addTodo() {
    if (input.value === "") return;

    let todo = {
        completed: false,
        content: input.value
    };

    input.value = "";
    updateStroge(todo, false);

    todos.append(drawTodo(todo));
}


function setLeft() {
    let Todos = JSON.parse(localStorage.getItem("todos"));

    let num = 0;

    for (let key in Todos) {
        if (Todos[key]) continue;
        num++;
    }

    left.innerText = num + " items left";
}


function updateStroge(todo, isDelete) {
    let storage = localStorage.getItem("todos");
    let Todos;

    if (!storage) {
        Todos = {};
    } else {
        Todos = JSON.parse(storage);
    }

    if (Object.keys(Todos).length === 0) todos.innerHTML = "";

    Todos[todo.content] = todo.completed;
    if (isDelete) delete Todos[todo.content];

    if (Object.keys(Todos).length === 0) todos.innerHTML += nothingTodo;
    localStorage.setItem("todos", JSON.stringify(Todos));
    setLeft();
}

function clearCompleted() {
    let Todos = JSON.parse(localStorage.getItem("todos"));

    for (let key in Todos) {
        if (Todos[key]) delete Todos[key];
    }

    localStorage.setItem("todos", JSON.stringify(Todos));
}


window.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTodo();
});


all.addEventListener('click', () => {
    if (all.classList.contains("in")) return;

    completed.classList.remove("in");
    active.classList.remove("in");

    drawTodos();
    all.classList.add("in");
});


active.addEventListener('click', () => {
    if (active.classList.contains("in")) return;

    completed.classList.remove("in");
    all.classList.remove("in");

    drawTodos('active');
    active.classList.add("in");
});

completed.addEventListener('click', () => {
    if (completed.classList.contains("in")) return;

    all.classList.remove("in");
    active.classList.remove("in");

    drawTodos('completed');
    completed.classList.add("in");
});

clear.addEventListener('click', () => {
    let condition = document.querySelector(".in").innerText.toLowerCase();

    clearCompleted();
    drawTodos(condition);
});

todos.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragged = document.querySelector(".dragged");
    const children = [...todos.querySelectorAll('.todo:not(.dragged)')];

    let Child = children.reduce((dist, child) => {
        let y = child.getBoundingClientRect().y + child.getBoundingClientRect().height/2;

        let diff = (y - e.clientY);

        if (diff > 0 && diff < dist.offset) {
            return {offset: diff, element: child};
        } else {
            return dist;
        }
    }, {offset: Infinity});

    
    if (Child.offset < 0 | !Child.element) {
        todos.append(dragged);
    } else {
        todos.insertBefore(dragged, Child.element);
    }
});


toggle.addEventListener('click', () => {
    let mode = toggle.classList.contains("sun") ? "sun" : "moon";
    let newmode = mode === "sun" ? "moon" : "sun";

    toggle.classList.remove(mode);
    toggle.classList.add(newmode);

    let newMode = newmode === "sun" ? "dark" : "light";
    let oldMode = newmode === "moon" ? "dark" : "light";
    let newModeTodo = newMode + "-todo";
    let oldModeTodo = oldMode + "-todo";

    [...document.querySelectorAll("." + oldMode)].forEach(elm => {
        elm.classList.remove(oldMode);
        elm.classList.add(newMode);
    });

    [...document.querySelectorAll("." + oldModeTodo)].forEach(elm => {
        elm.classList.remove(oldModeTodo);
        elm.classList.add(newModeTodo);
    });
});