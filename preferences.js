document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || !session.loggedIn) {
        window.location.href = 'index.html';
        return;
    }

    const preferenceForm = document.getElementById('preference-form');
    const statusContainer = document.getElementById('application-status-container');
    const statusEl = document.getElementById('application-status');
    const submitBtn = preferenceForm.querySelector('button[type="submit"]');
    const logoutBtn = document.getElementById('logout-btn');
    const preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    const userPreference = preferences.find(p => p.userEmail === session.userEmail);

    if (userPreference) {
        const status = userPreference.status;
        statusEl.innerHTML = `<span class="status-${status.toLowerCase().replace(/ & /g, '-')}">${status}</span>`;
        statusContainer.classList.remove('hidden');

        if (status === 'Accepted & Confirmed') {
            Array.from(preferenceForm.elements).forEach(el => el.disabled = true);
            submitBtn.textContent = 'Application Confirmed';
        }
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.email === session.userEmail);
    if (currentUser) {
        document.getElementById('pref-name').value = currentUser.name;
        document.getElementById('pref-email').value = currentUser.email;
    }

    preferenceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPreference = {
            userEmail: currentUser.email,
            roomType: document.getElementById('pref-room-type').value,
            messPlan: document.getElementById('pref-mess-plan').value,
            roommate: document.getElementById('pref-roommate').value,
            status: 'Pending'
        };
        let allPreferences = JSON.parse(localStorage.getItem('preferences')) || [];
        const existingPrefIndex = allPreferences.findIndex(p => p.userEmail === currentUser.email);
        if (existingPrefIndex > -1) {
            allPreferences[existingPrefIndex] = newPreference;
        } else {
            allPreferences.push(newPreference);
        }
        localStorage.setItem('preferences', JSON.stringify(allPreferences));
        alert('Your preferences have been saved successfully!');
        window.location.reload();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
    });
});