const API_URL = '/api';

const api = {
    getToken() {
        return localStorage.getItem('token');
    },
    
    getUserInfo() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    isAdmin() {
        const user = this.getUserInfo();
        return user && user.role === 'ADMIN';
    },

    async fetchAPI(endpoint, options = {}) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        if (options.body && typeof options.body !== 'string') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            
            if (response.status === 401 || response.status === 403) {
                // If not login route, handle unauthorized
                if (!endpoint.includes('/auth/login')) {
                    this.clearAuth();
                    window.location.href = 'login.html';
                }
            }

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;

            if (!response.ok) {
                const error = (data && data.message) || (data && data.error) || response.statusText;
                throw new Error(error);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};

// Global Notifications
function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;

    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
