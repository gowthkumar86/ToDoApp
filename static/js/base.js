   const todoForm = document.getElementById('todoForm');

    if (todoForm) {
        todoForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Clear previous messages
        clearMessages();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Prepare payload
        const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        priority: parseInt(data.priority),
        complete: false
        };

        // Basic client-side validation (optional)
        if (!payload.title || !payload.description) {
        showError('Title and Description are required.');
        return;
        }

        try {
        // Disable button & show loading
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...`;

        const response = await fetch('/todos/todo', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Success feedback
            showSuccess('Todo added successfully!');
            form.reset();
        } else {
            const errorData = await response.json();
            showError(`Error: ${errorData.detail || 'Unknown error occurred.'}`);
        }
        } catch (error) {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
        } finally {
        // Re-enable button and restore text
        submitBtn.disabled = false;
        submitBtn.innerHTML = '➕ Add New Todo';
        }
    });
    }



    // Edit Todo JS
    const editTodoForm = document.getElementById('editTodoForm');
    const deleteButton = document.getElementById('deleteButton');

    if (editTodoForm) {
        editTodoForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearMessages();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const url = window.location.pathname;
        const todoId = url.substring(url.lastIndexOf('/') + 1);

        const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        priority: parseInt(data.priority),
        complete: data.complete === "on"
        };

        // Basic client-side validation
        if (!payload.title || !payload.description) {
        showMessage('Title and Description cannot be empty.', 'warning');
        return;
        }

        try {
        const token = getCookie('access_token');
        if (!token) throw new Error('Authentication token not found');

        // Disable submit button + loading
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...`;

        const response = await fetch(`/todos/todo/${todoId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showMessage('Todo updated successfully!', 'success');
            // Redirect after short delay to let user see message
            setTimeout(() => {
            window.location.href = '/todos/todo-page';
            }, 1500);
        } else {
            const errorData = await response.json();
            showMessage(`Error: ${errorData.detail || 'Failed to update todo.'}`, 'danger');
        }
        } catch (error) {
        console.error(error);
        showMessage('An unexpected error occurred. Please try again.', 'danger');
        } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        }
        });
        
        deleteButton.addEventListener('click', async function () {
            clearMessages();
            if (!confirm('Are you sure you want to delete this todo? This action cannot be undone.')) {
            return;
            }

            const url = window.location.pathname;
            const todoId = url.substring(url.lastIndexOf('/') + 1);
            const btn = deleteButton;

            try {
            const token = getCookie('access_token');
            if (!token) throw new Error('Authentication token not found');

            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting...`;

            const response = await fetch(`/todos/todo/${todoId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showMessage('Todo deleted successfully!', 'success');
                setTimeout(() => {
                window.location.href = '/todos/todo-page';
                }, 1500);
            } else {
                const errorData = await response.json();
                showMessage(`Error: ${errorData.detail || 'Failed to delete todo.'}`, 'danger');
            }
            } catch (error) {
            console.error(error);
            showMessage('An unexpected error occurred. Please try again.', 'danger');
            } finally {
            btn.disabled = false;
            btn.innerHTML = '🗑️ Delete';
            }
        });
    }

    // View Todo in popup
    document.addEventListener('DOMContentLoaded', function () {
    const viewModal = document.getElementById('viewModal');
    const modalTitleText = document.getElementById('modalTitleText');
    const modalDescriptionText = document.getElementById('modalDescriptionText');

    viewModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description') || 'No description available.';

        modalTitleText.textContent = title;
        modalDescriptionText.textContent = description;
    });
    });


    // Login JS
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            const payload = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                payload.append(key, value);
            }

            try {
                const response = await fetch('/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: payload.toString()
                });

                if (response.ok) {
                    // Handle success (e.g., redirect to dashboard)
                    const data = await response.json();
                    // Delete any cookies available
                    logout();
                    // Save token to cookie
                    document.cookie = `access_token=${data.access_token}; path=/`;
                    window.location.href = '/todos/todo-page'; // Change this to your desired redirect page
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Register JS
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (data.password !== data.password2) {
                alert("Passwords do not match");
                return;
            }

            const payload = {
                email: data.email,
                username: data.username,
                first_name: data.firstname,
                last_name: data.lastname,
                role: data.role,
                phone_number: data.phone_number,
                password: data.password
            };

            try {
                const response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    window.location.href = '/auth/login-page';
                } else {
                    // Handle error
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }



    // Helper function to get a cookie by name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    function logout() {
        // Get all cookies
        const cookies = document.cookie.split(";");
    
        // Iterate through all cookies and delete each one
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            // Set the cookie's expiry date to a past date to delete it
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    
        // Redirect to the login page
        window.location.href = '/auth/login-page';
    };

    // Helper functions for messages
    function showError(message) {
        renderMessage(message, 'danger');
    }

    function showSuccess(message) {
        renderMessage(message, 'success');
    }

    function clearMessages() {
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();
    }

    function renderMessage(message, type) {
        clearMessages();

        const form = document.getElementById('todoForm');
        const div = document.createElement('div');
        div.className = `alert alert-${type} form-message mt-3`;
        div.setAttribute('role', 'alert');
        div.textContent = message;

        form.prepend(div);
    }

    function showMessage(message, type = 'info') {
        clearMessages();
        const form = editTodoForm;
        const div = document.createElement('div');
        div.className = `alert alert-${type} form-message mt-3`;
        div.setAttribute('role', 'alert');
        div.textContent = message;
        form.prepend(div);
    }