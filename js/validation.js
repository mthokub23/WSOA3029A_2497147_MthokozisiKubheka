document.addEventListener('DOMContentLoaded', () => {
    const firstVisitModal = document.getElementById('firstVisitModal');
    const registrationSection = document.getElementById('registrationSection');
    const loginSection = document.getElementById('loginSection');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const closeModalButton = document.querySelector('.homeclose-modal');
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const formMessage = document.getElementById('formMessage');
    const loginMessage = document.getElementById('loginMessage');
    const passwordField = document.getElementById('password');
    const confirmPasswordFieldset = document.getElementById('confirmPasswordFieldset');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');
    const loginEmailOrPhoneField = document.getElementById('loginEmailOrPhone');
    const loginPasswordField = document.getElementById('loginPassword');
    const toggleLoginPasswordButton = document.getElementById('toggleLoginPassword');

    // Show modal only on first visit
    if (!localStorage.getItem('visited')) {
        firstVisitModal.style.display = 'flex';
        localStorage.setItem('visited', 'true');
    }

    // Close modal on 'X' click or background click
    closeModalButton.addEventListener('click', closeModalWindow);
    window.addEventListener('click', (event) => {
        if (event.target === firstVisitModal) closeModalWindow();
    });

    function closeModalWindow() {
        firstVisitModal.style.display = 'none';
    }

    // Toggle registration form visibility on "Register" button click
    registerButton.addEventListener('click', () => {
        firstVisitModal.style.display = 'none';
        registrationSection.scrollIntoView({ behavior: 'smooth' });
        registrationSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
    });

    // Toggle login form visibility on "Login" button click
    loginButton.addEventListener('click', () => {
        firstVisitModal.style.display = 'none';
        loginSection.scrollIntoView({ behavior: 'smooth' });
        loginSection.classList.remove('hidden');
        registrationSection.classList.add('hidden');
    });

    // Show confirm password field when password is entered
    passwordField.addEventListener('input', () => {
        if (passwordField.value.length > 0) {
            confirmPasswordFieldset.classList.remove('hidden');
        } else {
            confirmPasswordFieldset.classList.add('hidden');
        }
    });

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePasswordButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    toggleConfirmPasswordButton.addEventListener('click', () => {
        const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordField.setAttribute('type', type);
        toggleConfirmPasswordButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    toggleLoginPasswordButton.addEventListener('click', () => {
        const type = loginPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPasswordField.setAttribute('type', type);
        toggleLoginPasswordButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Validate registration form fields on submit
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordField.value.trim();
        const confirmPassword = confirmPasswordField.value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate each field and display a message if invalid
        if (!/^[A-Za-z\s]+$/.test(name)) {
            showError(formMessage, "Name must only contain letters and spaces.");
            return;
        }
        if (!/^[\w.-]+@(gmail|outlook|icloud|yahoo|hotmail)\.com$/.test(email)) {
            showError(formMessage, "Please enter a valid email.");
            return;
        }
        if (!/^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(password)) {
            showError(formMessage, "Password must include numbers and special characters, min 8 chars.");
            return;
        }
        if (password !== confirmPassword) {
            showError(formMessage, "Passwords do not match.");
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            showError(formMessage, "Phone number must be exactly 10 digits.");
            return;
        }
        if (message.length > 250) {
            showError(formMessage, "Message cannot exceed 250 characters.");
            return;
        }

        // Store user data in localStorage
        const userData = { name, email, phone, password };
        localStorage.setItem('userData', JSON.stringify(userData));

        formMessage.style.color = "#4CAF50";
        formMessage.textContent = "Registration successful!";
        registrationForm.reset(); // Reset form fields
        confirmPasswordFieldset.classList.add('hidden'); // Hide confirm password field
    });

    // Validate login form fields on submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginEmailOrPhone = loginEmailOrPhoneField.value.trim();
        const loginPassword = loginPasswordField.value.trim();

        // Retrieve user data from localStorage
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (!storedUserData) {
            showError(loginMessage, "No account found. Please sign up.");
            return;
        }

        const { email, phone, password } = storedUserData;

        // Validate login credentials
        if ((loginEmailOrPhone === email || loginEmailOrPhone === phone) && loginPassword === password) {
            loginMessage.style.color = "#4CAF50";
            loginMessage.textContent = "Login successful!";
        } else {
            showError(loginMessage, "Incorrect email/phone or password. Please try again.");
        }
    });

    // Validate password match on input
    confirmPasswordField.addEventListener('input', () => {
        if (passwordField.value === confirmPasswordField.value) {
            passwordMatchMessage.style.color = "#4CAF50";
            passwordMatchMessage.textContent = "Passwords match.";
        } else {
            passwordMatchMessage.style.color = "#ff4d4d";
            passwordMatchMessage.textContent = "Passwords do not match.";
        }
    });

    function showError(element, message) {
        element.style.color = "#ff4d4d";
        element.textContent = message;
    }
});