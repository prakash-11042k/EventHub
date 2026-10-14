// Setup Navigation State
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

function setupNavigation() {
    const navLinks = document.getElementById('dynamic-nav');
    if (!navLinks) return;

    if (api.isLoggedIn()) {
        const user = api.getUserInfo();
        let html = `
            <a href="events.html" class="nav-link">Events</a>
            <a href="my-registrations.html" class="nav-link">My Registrations</a>
            <a href="profile.html" class="nav-link">Profile (${user.fullName})</a>
        `;
        
        if (api.isAdmin()) {
            html += `<a href="admin-dashboard.html" class="nav-link">Admin Dashboard</a>`;
        }
        
        html += `<button onclick="handleLogout()" class="btn btn-secondary">Logout</button>`;
        navLinks.innerHTML = html;
    } else {
        navLinks.innerHTML = `
            <a href="events.html" class="nav-link">Events</a>
            <a href="login.html" class="nav-link">Login</a>
            <a href="register.html" class="btn btn-primary">Sign Up</a>
        `;
    }
}

function handleLogout() {
    api.clearAuth();
    window.location.href = 'index.html';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    // timeString is like 14:30:00
    const [hours, minutes] = timeString.split(':');
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(minutes);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
