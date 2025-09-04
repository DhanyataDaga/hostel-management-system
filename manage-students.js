document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || !session.loggedIn || session.role !== 'admin') {
        alert('Access Denied. You are not an admin.');
        window.location.href = 'index.html';
        return;
    }

    const studentsList = document.getElementById('students-list');
    const modal = document.getElementById('details-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalStudentDetails = document.getElementById('modal-student-details');
    const modalActionButtons = document.getElementById('modal-action-buttons');

    function renderStudents() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const preferences = JSON.parse(localStorage.getItem('preferences')) || [];
        studentsList.innerHTML = ''; 

        users.forEach(user => {
            const userPreference = preferences.find(p => p.userEmail === user.email);
            const status = userPreference ? userPreference.status : 'Not Submitted';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-${status.toLowerCase().replace(/ & /g, '-')}">${status}</span></td>
                <td class="actions">
                    <button class="btn-view" data-email="${user.email}">View Details</button>
                    <button class="btn-delete" data-email="${user.email}">Delete</button>
                </td>
            `;
            studentsList.appendChild(row);
        });
    }

    function updatePreferenceStatus(userEmail, newStatus) {
        let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
        const prefIndex = preferences.findIndex(p => p.userEmail === userEmail);
        if (prefIndex > -1) {
            preferences[prefIndex].status = newStatus;
            localStorage.setItem('preferences', JSON.stringify(preferences));
            renderStudents();
        }
    }

    studentsList.addEventListener('click', (e) => {
        const userEmail = e.target.dataset.email;
        if (e.target.classList.contains('btn-view')) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const preferences = JSON.parse(localStorage.getItem('preferences')) || [];
            const user = users.find(u => u.email === userEmail);
            const preference = preferences.find(p => p.userEmail === userEmail);
            modalStudentName.textContent = user.name;
            if (preference) {
                modalStudentDetails.innerHTML = `
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Room Type:</strong> ${preference.roomType}</p>
                    <p><strong>Mess Plan:</strong> ${preference.messPlan}</p>
                    <p><strong>Roommate:</strong> ${preference.roommate || 'None'}</p>
                `;
                modalActionButtons.innerHTML = `
                    <button class="btn-accept" data-email="${userEmail}">Accept & Confirm</button>
                    <button class="btn-reject" data-email="${userEmail}">Reject</button>
                `;
            } else {
                modalStudentDetails.innerHTML = `<p>This student has not submitted their preferences yet.</p>`;
                modalActionButtons.innerHTML = '';
            }
            modal.classList.add('active');
            modalOverlay.classList.add('active');
        }
        if (e.target.classList.contains('btn-delete')) {
            if (confirm('Are you sure you want to delete this student and all their data?')) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
                localStorage.setItem('users', JSON.stringify(users.filter(u => u.email !== userEmail)));
                localStorage.setItem('preferences', JSON.stringify(preferences.filter(p => p.userEmail !== userEmail)));
                renderStudents();
            }
        }
    });

    modalActionButtons.addEventListener('click', (e) => {
        const userEmail = e.target.dataset.email;
        if (e.target.classList.contains('btn-accept')) {
            updatePreferenceStatus(userEmail, 'Accepted & Confirmed');
        }
        if (e.target.classList.contains('btn-reject')) {
            updatePreferenceStatus(userEmail, 'Rejected');
        }
        closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }
    modalOverlay.addEventListener('click', closeModal);
    document.querySelector('.modal-close-btn').addEventListener('click', closeModal);

    renderStudents();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
    });
});