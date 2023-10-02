
fetch('https://content-management-4mwe.onrender.com/product/all', {
    headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token")
    }
}) // Replace with your actual API endpoint
    .then(response => response.json())
    .then(data => {
        const contentSection = document.querySelector('.content');

        // Check if data is an array
        if (Array.isArray(data)) {
            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="Movie Poster">
                    <h1><span style="color: blue;">Title:-</span>${item.title}</h1>
                    <h2><span style="color: blue;">Category:-</span>${item.category}</h2>
                    <p><span style="color: blue;">Description:-</span>${item.description}</p>
                `;
                contentSection.appendChild(itemElement);
            });
        } else {
            console.error('API data is not an array:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching API data:', error);
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

