(function() {
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Hash of the correct password (replace with your own hashed password)
    const correctPasswordHash = '6991c8a1bc5494ded06971d5a4937a907863055f37150a34c24e8cddf9a59c2d'; // SHA-256 hash of 'password'

    let loginAttempts = 0;
    const maxLoginAttempts = 5;
    const lockoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    function hashPassword(password) {
        return CryptoJS.SHA256(password).toString();
    }

    function checkPassword(inputPassword) {
        return hashPassword(inputPassword) === correctPasswordHash;
    }

    function handleLogin(e) {
        e.preventDefault();

        if (loginAttempts >= maxLoginAttempts) {
            const remainingTime = Math.ceil((parseInt(localStorage.getItem('lockoutEndTime')) - Date.now()) / 1000);
            errorMessage.textContent = `Trop de tentatives. Réessayez dans ${remainingTime} secondes.`;
            return;
        }

        const password = passwordInput.value;

        if (checkPassword(password)) {
            // Successful login
            loginAttempts = 0;
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutEndTime');

            // Set authentication token
            const authToken = CryptoJS.SHA256(Date.now().toString()).toString();
            localStorage.setItem('authToken', authToken);
            
            window.location.href = 'form.html';
        } else {
            // Failed login
            loginAttempts++;
            localStorage.setItem('loginAttempts', loginAttempts);

            if (loginAttempts >= maxLoginAttempts) {
                const lockoutEndTime = Date.now() + lockoutTime;
                localStorage.setItem('lockoutEndTime', lockoutEndTime);
                errorMessage.textContent = `Trop de tentatives. Réessayez dans 15 minutes.`;
            } else {
                errorMessage.textContent = `Mot de passe incorrect. ${maxLoginAttempts - loginAttempts} tentatives restantes.`;
            }
        }

        // Clear password field
        passwordInput.value = '';
    }

    function checkLockout() {
        loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        const lockoutEndTime = parseInt(localStorage.getItem('lockoutEndTime')) || 0;

        if (lockoutEndTime && Date.now() < lockoutEndTime) {
            const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000);
            errorMessage.textContent = `Trop de tentatives. Réessayez dans ${remainingTime} secondes.`;
            form.removeEventListener('submit', handleLogin);
            setTimeout(checkLockout, 1000);
        } else if (lockoutEndTime && Date.now() >= lockoutEndTime) {
            loginAttempts = 0;
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutEndTime');
            form.addEventListener('submit', handleLogin);
            errorMessage.textContent = '';
        } else {
            form.addEventListener('submit', handleLogin);
        }
    }

    // Initial check
    checkLockout();
})();