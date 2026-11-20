
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");

const taskList = document.querySelector("#taskList");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.querySelector("#emptyMessage");

// Recupera as tarefas salvas no navegador
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "todas";

// Salva as tarefas no LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Atualiza os números do painel
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    document.querySelector("#totalTasks").textContent = total;
    document.querySelector("#pendingTasks").textContent = pending;
    document.querySelector("#completedTasks").textContent = completed;
}

// Adiciona uma nova tarefa
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskInput.value.trim();
    const priority = priorityInput.value;

    if (name === "") return;

    const newTask = {
        id: Date.now(),
        name: name,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Exibe as tarefas na tela
function renderTasks() {
    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {

        const matchesSearch = task.name.toLowerCase().includes(search);

        const matchesFilter =
            currentFilter === "todas" ||
            (currentFilter === "pendentes" && !task.completed) ||
            (currentFilter === "concluidas" && task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = `Prioridade ${task.priority}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        info.append(checkbox, name);

        item.append(info, priority, deleteButton);

        taskList.appendChild(item);
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStats();
}

// Marca ou desmarca uma tarefa
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Exclui uma tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Aplica os filtros
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Pesquisa tarefas pelo nome
searchInput.addEventListener("input", renderTasks);

// Inicializa o sistema
renderTasks();


const filteredTasks = tasks.filter(task => {

    const matchesSearch = task.name
        .toLowerCase()
        .includes(search);

    const matchesFilter =
        currentFilter === "todas" ||
        (currentFilter === "pendentes" && !task.completed) ||
        (currentFilter === "concluidas" && task.completed);

    return matchesSearch && matchesFilter;
});