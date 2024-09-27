(function() {
    function checkAuth() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            // No auth token found, redirect to login page
            window.location.href = 'index.html';
        }
    }

    // Check authentication immediately
    checkAuth();

    // Also check authentication when the page becomes visible (in case of browser back button use)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkAuth();
        }
    });
})();