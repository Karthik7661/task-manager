const API_URL = "http://localhost:8080/api/tasks";

/* ===========================
   FETCH ALL TASKS
=========================== */
async function fetchTasks() {
    const response = await fetch(API_URL);
    const data = await response.json();

    // If using pagination
    if (data.content) {
        displayTasks(data.content);
    } else {
        displayTasks(data);
    }
}

/* ===========================
   DISPLAY TASKS
=========================== */
function displayTasks(tasks) {

    const container = document.getElementById("taskContainer");
    container.innerHTML = "";

    tasks.forEach(task => {

        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>

            <span class="status ${task.status}">
                ${task.status}
            </span>

            <span class="priority">
                ${task.priority}
            </span>

            <div class="actions">
                <button onclick="toggleStatus(${task.id}, '${task.status}')">
                    Toggle Status
                </button>

                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

/* ===========================
   CREATE TASK
=========================== */
async function createTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;
    const priority = document.getElementById("priority").value;

    if (!title.trim()) {
        alert("Title is required");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            description,
            status,
            priority,
            dueDate: "2026-03-10T10:00:00"
        })
    });

    clearForm();
    fetchTasks();
}

/* ===========================
   DELETE TASK
=========================== */
async function deleteTask(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchTasks();
}

/* ===========================
   STATUS ROTATION LOGIC
=========================== */
async function toggleStatus(id, currentStatus) {

    let newStatus;

    if (currentStatus === "PENDING") {
        newStatus = "IN_PROGRESS";
    } else if (currentStatus === "IN_PROGRESS") {
        newStatus = "COMPLETED";
    } else {
        newStatus = "PENDING";
    }

    const response = await fetch(`${API_URL}/${id}`);
    const task = await response.json();

    task.status = newStatus;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    fetchTasks();
}

/* ===========================
   SEARCH TASKS
=========================== */
async function searchTasks() {

    const keyword = document
        .getElementById("searchInput")
        .value;

    if (!keyword.trim()) {
        fetchTasks();
        return;
    }

    const response = await fetch(
        `${API_URL}/search?keyword=${keyword}`
    );

    const tasks = await response.json();

    displayTasks(tasks);
}

/* ===========================
   CLEAR FORM
=========================== */
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

/* ===========================
   INITIAL LOAD
=========================== */
fetchTasks();