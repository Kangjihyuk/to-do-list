document.addEventListener("DOMContentLoaded", () => {
  const saveTodos = datas();
  todos.push(...saveTodos);
  document.dispatchEvent(new Event(RENDER_EVENT));
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo();
  });
});

const todos = [];
const RENDER_EVENT = "render-todo";

const addTodo = () => {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generatedId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );

  todos.push(todoObject);
  data();
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const generatedId = () => {
  return +new Date();
};

const generateTodoObject = (id, task, timestamp, isCompleted) => {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
};

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";
  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = "";
  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

const makeTodo = (todoObject) => {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);
  data();
  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", () => {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", () => {
      removeTaskCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", () => {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
};

const addTaskToCompleted = (TodoId) => {
  const todoTarget = findTodo(TodoId);

  if (todoTarget == null) return;
  data();

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const findTodo = (TodoId) => {
  for (const todoItem of todos) {
    if (todoItem.id === TodoId) {
      return todoItem;
    }
  }
  return null;
};

const removeTaskCompleted = (todoId) => {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;
  removeDatas();
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const undoTaskFromCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const findTodoIndex = (todoId) => {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
};

const local = "local";
const data = () => {
  localStorage.setItem(local, JSON.stringify(todos));
};

const datas = () => {
  return JSON.parse(localStorage.getItem(local)) || [];
};

const removeDatas = () => {
  localStorage.removeItem(local);
};
