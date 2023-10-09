document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const tasksList = document.getElementById("tasks");


    // Function to fetch and display user details
    function fetchUserDetails() {
        fetch("http://localhost:9999/user", {
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const userDetailsList = document.getElementById("userDetails");

                // Clear existing user details
                userDetailsList.innerHTML = "";

                // Loop through the user data and display each user
                data.forEach((user) => {
                    const li = document.createElement("li");
                    li.innerHTML = `Name: ${user.name} <br> Email: ${user.email} <br>Unique ID: ${user._id}<br>Number of Task: ${user.tasks.length}<br>`;
                    userDetailsList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Function to fetch and display tasks
    function fetchTasks() {
        fetch("http://localhost:9999/task", {
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => response.json())
            .then((data) => {
                tasksList.innerHTML = "";
                data.tasks.forEach((task) => {
                    displayTask(task);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Function to display a task
    function displayTask(task) {
        const li = document.createElement("li");

        // Parse the dueDate string and format it as "YYYY-MM-DD"
        const dueDate = new Date(task.dueDate).toISOString().split('T')[0];

        li.innerHTML = `
        <h3>Title:- ${task.title}</h3>
        <p>Description: ${task.description}</p>
        <p>Assigned To: ${task.assignedTo.name}</p>
        <p>Task creator : ${task.taskcreator.name}</p>
        <p>Status: ${task.status}</p>
        <p>Due Date: ${dueDate}</p>
    `;
        console.log(task)
        // Create buttons for edit and delete
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.style.backgroundColor = "#007bff";
        editButton.style.color = "#fff";
        editButton.style.border = "none";
        editButton.style.padding = "10px 20px";
        editButton.style.borderRadius = "5px";
        editButton.style.fontSize = "16px";
        editButton.style.cursor = "pointer";
        editButton.style.transition = "background-color 0.3s ease";
        // Add a hover effect for the "Edit" button
        editButton.addEventListener("mouseenter", () => {
            editButton.style.backgroundColor = "#0056b3"; // Darker shade on hover
        });

        editButton.addEventListener("mouseleave", () => {
            editButton.style.backgroundColor = "#007bff"; // Restore original color on mouseout
        });
        editButton.addEventListener("click", () => openEditPopup(task));

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.backgroundColor = "#dc3545";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "10px 20px";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.fontSize = "16px";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.transition = "background-color 0.3s ease";

        // Add a hover effect for the "Delete" button
        deleteButton.addEventListener("mouseenter", () => {
            deleteButton.style.backgroundColor = "#c82333"; // Darker shade on hover
        });

        deleteButton.addEventListener("mouseleave", () => {
            deleteButton.style.backgroundColor = "#dc3545"; // Restore original color on mouseout
        });

        // Add a click event handler for the "Delete" button
        deleteButton.addEventListener("click", () => deleteTask(task._id));

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        tasksList.appendChild(li);
    }

    // Function to create a new task
    function createTask(formData) {
        fetch("http://localhost:9999/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    alert("task added successfully")
                    fetchTasks(); // Fetch and display updated tasks
                    taskForm.reset(); // Reset the form
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function openEditPopup(task) {
        Swal.fire({
            title: 'Edit Task',
            html:
                `<input id="swal-input-title" class="swal2-input" value="${task.title}" placeholder="Edit Title">` +
                `<input id="swal-input-description" class="swal2-input" placeholder="Edit Description" value="${task.description}">` +

                `<select id="swal-input-status" class="swal2-select">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>` +
                `<input id="swal-input-dueDate" class="swal2-input" type="date" value="${task.dueDate}" placeholder="Edit Due Date">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-input-title').value,
                    description: document.getElementById('swal-input-description').value,
                    assignedTo: task.assignedTo._id,
                    status: document.getElementById('swal-input-status').value,
                    dueDate: document.getElementById('swal-input-dueDate').value,
                };
            },
            customClass: {
                // Define custom CSS classes for various elements of the Swal task form
                container: 'swal2-container',
                popup: 'swal2-popup',
                header: 'swal2-header',
                title: 'swal2-title',
                closeButton: 'swal2-close-button',
                content: 'swal2-content',
                input: 'swal2-input',
                select: 'swal2-select',
                textarea: 'swal2-textarea',
                actions: 'swal2-actions',
                confirmButton: 'swal2-confirm-button',
                cancelButton: 'swal2-cancel-button',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedTaskData = result.value;

                fetch(`http://localhost:9999/task/${task._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify(updatedTaskData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.error(data.error);
                        } else {
                            task.title = updatedTaskData.title;
                            task.description = updatedTaskData.description;
                            task.assignedTo = updatedTaskData.assignedTo;
                            task.status = updatedTaskData.status;
                            task.dueDate = updatedTaskData.dueDate;

                            alert("Task updated successfully");
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }



    // Function to delete a task
    function deleteTask(taskId) {
        // Display a confirmation dialog to confirm deletion
        const confirmDeletion = confirm("Are you sure you want to delete this task?");

        if (confirmDeletion) {
            // Send a DELETE request to delete the task
            fetch(`http://localhost:9999/task/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        // Remove the task from the UI
                        // You can identify the task element in the UI using its taskId
                        const taskElement = document.getElementById(taskId);
                        if (taskElement) {
                            taskElement.remove();
                        }

                        // Optional: Display a success message to the user
                        alert("Task deleted successfully");
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    // Event listener for form submission
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            description: e.target.description.value,
            assignedTo: e.target.assignedTo.value,
            dueDate: e.target.dueDate.value,
        };
        createTask(formData);
        console.log(formData);
    });


    // Featch all user

    fetchUserDetails();
    // Fetch and display tasks when the page loads
    fetchTasks();
});


function checkTokenalluser() {
    const token = localStorage.getItem('token');
    if (token) {
        // Token exists, allow access to the page
        Swal.fire({
            title: 'Access Granted',
            text: 'You have access to the protected page.',
            icon: 'success'
        });


        window.location.href = 'content.html';
        // window.open("./page/mycontent.html")
    } else {
        // Token does not exist, show an alert and redirect to a login page
        Swal.fire({
            title: 'Access Denied',
            text: 'Please log in to access this page.',
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to the login page
                window.location.href = '../index.html';
            }
        });
    }
}

function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
        // Token exists, allow access to the page
        Swal.fire({
            title: 'Access Granted',
            text: 'You have access to the protected page.',
            icon: 'success'
        });


        window.location.href = 'mycontent.html';
        // window.open("./page/mycontent.html")
    } else {
        // Token does not exist, show an alert and redirect to a login page
        Swal.fire({
            title: 'Access Denied',
            text: 'Please log in to access this page.',
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to the login page
                window.location.href = '../index.html';
            }
        });
    }
}


// Add logout functionality with Swal confirmation
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function () {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed the logout
            // Remove the token and user name from Local Storage
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('user');
            // Redirect to the login page after logout
            window.location.href = '../index.html';
        }
    });
});

