if (!localStorage.getItem("todos")) localStorage.setItem("todos", JSON.stringify({}));

let nothingTodo = `
    <div class="todo rm-r">
        <p>You have nothing to do!</p>
    </div>
`;


let noActives = `
    <div class="todo rm-r">
        <p>You have no active todos!</p>
    </div>
`;

let noCompleted = `
    <div class="todo rm-r">
        <p>All completed todos were deleted!</p>
    </div>
`;