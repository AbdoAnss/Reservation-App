
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

//
