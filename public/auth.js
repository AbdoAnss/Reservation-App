
// this is a script for the login/signup page
// togle between login and signup form

function toggleForm() {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    var formTitle = document.getElementById('formTitle');
    var title = document.getElementById('form-title');

    if (loginForm.style.display === 'none') {
      title.innerText = 'Login';
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      formTitle.textContent = 'Signup';
      

    } else {
      title.innerText = 'Signup';
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      formTitle.textContent = 'Login';
    }
  }

  function validateForm() {
    var password = document.getElementById("signup-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

// Si on veut faire une vérification de mot de passe dans le front-end, il faut utiliser le code ci-dessous:

    // if (password !== confirmPassword) {
    //   alert("Passwords do not match. Please check and try again.");
    //   return false; // Prevent form submission
    // } else if (password === "" || confirmPassword === "") {
    //   alert("Passwords cannot be empty. Please check and try again.");
    //   return false; // Prevent form submission
    // } else if (password.length < 8 || confirmPassword.length < 8) {
    //   alert("Passwords must be at least 8 characters long. Please check and try again.");
    //   return false; // Prevent form submission
    // }

    return true; // Allow form submission
  }

//
