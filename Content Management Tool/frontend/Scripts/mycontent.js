document.addEventListener("DOMContentLoaded", () => {
    const contentSection = document.getElementById('content');
    const crudForm = document.getElementById('crudForm');
    const titleInput = document.getElementById('title');
    const imageInput = document.getElementById('image');
    const categoryInput = document.getElementById('category');
    const descriptionInput = document.getElementById('description');
    const userdata = localStorage.getItem("user")
    // Function to fetch data from the API and display it
    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:3000/product?user=${userdata}`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: localStorage.getItem("token")
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            // console.log(response.ok)
            const data = await response.json();
            console.log(data)
            contentSection.innerHTML = ''; // Clear existing content

            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                    <h1><span style="color: blue;">Title:-</span>${item.title}</h1>
                    <img src="${item.image}" alt="${item.title}">
                    <h2><span style="color: blue;">Category:-</span>${item.category}</h2>
                    <h3><span style="color: blue;">Description:-</span>${item.description}</h3>
                    <button class="updateButton" data-id="${item._id}">Update</button>
                    <button class="deleteButton" data-id="${item._id}">Delete</button>
                `;
                contentSection.appendChild(itemElement);
            });
        } catch (error) {
            console.error('Error fetching API data:', error);
        }
    }


    // Fetch data on page load
    fetchData();

    // Add event listener for form submission
    crudForm.addEventListener('submit', e => {
        e.preventDefault();

        const title = titleInput.value;
        const image = imageInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;

        // Replace with your API endpoint
        fetch('http://localhost:3000/product', {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify({ title, image, category, description }),
        })
            .then(response => response.json())
            .then(() => {
                titleInput.value = '';
                imageInput.value = '';
                categoryInput.value = '';
                descriptionInput.value = '';
                fetchData();
            })
            .catch(error => {
                console.error('Error creating data:', error);
            });
    });

    // Add event listeners for update and delete buttons
    contentSection.addEventListener('click', e => {
        if (e.target.classList.contains('updateButton')) {
            const itemId = e.target.getAttribute('data-id');
            const updatedTitle = prompt('Enter updated title:');
            const updatedImage = prompt('Enter updated image URL:');
            const updatedCategory = prompt('Enter updated category:');
            const updatedDescription = prompt('Enter updated description:');

            if (updatedTitle !== null && updatedImage !== null && updatedCategory !== null && updatedDescription !== null) {
                // Replace with your API endpoint
                fetch(`http://localhost:3000/product/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-type": "application/json",
                        Authorization: localStorage.getItem("token")
                    },
                    body: JSON.stringify({ title: updatedTitle, image: updatedImage, category: updatedCategory, description: updatedDescription }),
                })
                    .then(response => response.json())
                    .then(() => {
                        fetchData();
                    })
                    .catch(error => {
                        console.error('Error updating data:', error);
                    });
            }
        } else if (e.target.classList.contains('deleteButton')) {
            const itemId = e.target.getAttribute('data-id');
            const confirmDelete = confirm('Are you sure you want to delete this item?');

            if (confirmDelete) {
                // Replace with your API endpoint
                fetch(`http://localhost:3000/product/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json",
                        Authorization: localStorage.getItem("token")
                    }
                })
                    .then(() => {
                        fetchData();
                    })
                    .catch(error => {
                        console.error('Error deleting data:', error);
                    });
            }
        }
    });
});



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

