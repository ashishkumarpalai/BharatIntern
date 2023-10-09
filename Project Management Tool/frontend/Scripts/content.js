

document.addEventListener("DOMContentLoaded", () => {
    const usersList = document.getElementById("users");
    const tasksList = document.getElementById("tasks");
    const userDetailsContainer = document.getElementById("user-details-container");

    // Function to fetch all users and display them
    function fetchUsers() {
        fetch("http://localhost:9999/user", {
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => response.json())
            .then((data) => {
                
                console.log(data)
                data.forEach((user) => {
                    displayUser(user);
                });
                
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Function to fetch tasks for a specific user and display them
    function fetchTasksForUser(userId) {
        fetch(`http://localhost:9999/user/${userId}`, {
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

    // Function to display a user
    function displayUser(user) {
        const userListItem = document.createElement("li");
        userListItem.innerHTML = `
                    <p>Name: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Task: ${user.tasks.length}</p>
                `

        userListItem.addEventListener("click", () => {
            // displayUserDetails(user);
            fetchTasksForUser(user._id);
        });
        usersList.appendChild(userListItem);
    }

    // Function to display user details
    function displayUserDetails(user) {
        userDetailsContainer.innerHTML = ""; // Clear previous user details

        // Create a div to display user details
        const userDetailsDiv = document.createElement("div");
        userDetailsDiv.classList.add("user-details-card");
        userDetailsDiv.innerHTML = `
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <!-- Add other user details here -->
                `;

        userDetailsContainer.appendChild(userDetailsDiv);
    }

    // Function to display a task
    function displayTask(task) {
        const taskItem = document.createElement("li");
        // Parse the dueDate string and format it as "YYYY-MM-DD"
        const dueDate = new Date(task.dueDate).toISOString().split('T')[0];

        taskItem.innerHTML = `
                    <h2>Title: ${task.title}</h2>
                    <p>Description: ${task.description}</p>
                    <p>Due Date: ${dueDate}</p>
                    <p>Status: ${task.status}</p>
                `;

        // Fetch the task creator's details based on task.taskcreator
        fetch(`http://localhost:9999/user/${task.taskcreator}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => response.json())
            .then((user) => {
                
                const creatorDetails = document.createElement("div");
                creatorDetails.innerHTML = `<p>Task Creator: Name:- <span style="color: blue;">${user.name}</span>, Email:- <span style="color: blue;">${user.email}</span></p>`;
                taskItem.appendChild(creatorDetails);
            })
            .catch((error) => {
                console.error(error);
            });

        tasksList.appendChild(taskItem);
    }

    // Fetch and display users when the page loads
    fetchUsers();
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

