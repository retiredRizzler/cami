(function() {
    const sessionDuration = 15 * 60 * 1000; // 15 minutes in milliseconds

    function checkAuthAndSession() {
        const authToken = localStorage.getItem('authToken');
        const authExpiration = parseInt(localStorage.getItem('authExpiration')) || 0;

        if (!authToken || authExpiration <= Date.now()) {
            // No auth token found or session expired, redirect to login page
            logout();
        }
    }

    function refreshSession() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            // Refresh the session expiration time
            const newExpirationTime = Date.now() + sessionDuration;
            localStorage.setItem('authExpiration', newExpirationTime);
        }
    }

    function logout() {
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiration');
        
        // Reset login attempts
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutEndTime');

        // Redirect to login page
        window.location.href = 'index.html';
    }

    // Expose logout function globally
    window.logout = logout;

    // Check authentication and session immediately
    checkAuthAndSession();

    // Refresh session on user activity
    ['click', 'touchstart', 'mousemove', 'keypress'].forEach(eventName => {
        document.addEventListener(eventName, refreshSession, { passive: true });
    });

    // Check authentication and session when the page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkAuthAndSession();
        }
    });

    // Periodically check authentication and session
    setInterval(checkAuthAndSession, 60000); // Check every minute
})();