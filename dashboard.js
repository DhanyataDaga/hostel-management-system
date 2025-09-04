document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || !session.loggedIn) {
        window.location.href = 'index.html';
        return;
    }
    const welcomeMessage = document.getElementById('welcome-message');
    if (session.role === 'admin') {
        welcomeMessage.textContent = 'Welcome, Admin!';
        document.body.classList.add('admin-mode');
    } else {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.email === session.userEmail);
        welcomeMessage.textContent = `Welcome, ${currentUser ? currentUser.name : 'Student'}!`;
        document.body.classList.add('student-mode');
    }

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
    });

    const statCards = document.querySelectorAll('[data-modal-target]');
    const modalOverlay = document.getElementById('modal-overlay');

    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const modal = document.querySelector(card.dataset.modalTarget);
            openModal(modal);
        });
    });

    modalOverlay.addEventListener('click', () => {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) closeModal(activeModal);
    });

    document.querySelectorAll('.modal-close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    document.querySelectorAll('.modal-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Action submitted! (Functionality can be expanded here)");
            const modal = form.closest('.modal');
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }
});