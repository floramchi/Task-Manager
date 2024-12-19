const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// Backend API URL
const BASE_URL = "https://task-manager-nwhi.onrender.com";  // Update this with your deployed backend URL

// Function to Fetch All Tasks from the Backend
async function fetchTasks() {
    try {
        const response = await fetch(`${BASE_URL}/get_tasks`);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Function to Render Tasks in the UI
function renderTasks(tasks) {
    taskList.innerHTML = ""; // Clear current tasks

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text} - [${task.category}]
            </span>
            <div>
                <input type="checkbox" ${task.completed ? "checked" : ""} 
                    onclick="updateTask('${task._id}', ${!task.completed})">
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Function to Add a New Task
addTaskButton.addEventListener("click", async () => {
    const taskText = taskInput.value.trim();
    const category = taskCategory.value;

    if (taskText) {
        try {
            const response = await fetch(`${BASE_URL}/add_task`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: taskText, category: category }),
            });

            if (response.ok) {
                taskInput.value = "";  // Clear input field
                fetchTasks();  // Refresh task list
            } else {
                console.error("Failed to add task");
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    } else {
        alert("Task cannot be empty!");
    }
});

// Function to Update Task Completion Status
async function updateTask(id, completed) {
    try {
        console.log(`Updating task ${id} to completed: ${completed}`);  // Debugging log
        const response = await fetch(`${BASE_URL}/update_task/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: completed }),
        });

        if (response.ok) {
            fetchTasks();  // Refresh task list
        } else {
            console.error("Failed to update task");
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Function to Delete a Task
async function deleteTask(id) {
    try {
        const response = await fetch(`${BASE_URL}/delete_task/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchTasks();  // Refresh task list
        } else {
            console.error("Failed to delete task");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Initial Fetch to Load Tasks on Page Load
fetchTasks();
