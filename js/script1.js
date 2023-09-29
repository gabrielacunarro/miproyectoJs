//FORMULARIO DE INICIO DE SESIÓN/REGISTRO

const btnSigIn = document.getElementById("sign-in");
const btnSigUp = document.getElementById("sign-up");
const formRegister = document.querySelector(".register");
const formLogin = document.querySelector(".login");

btnSigIn.addEventListener("click", e => {
    formRegister.classList.add("hide");
    formLogin.classList.remove("hide");
})

btnSigUp.addEventListener("click", e => {
    formLogin.classList.add("hide");
    formRegister.classList.remove("hide");
})

// obtengo los elementos del formulario de registro e inicio sesión
const registerForm = document.querySelector(".container-form.register form");
const loginForm = document.querySelector(".container-form.login form");

// registro de usuario
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // obtengo los value del formulario de registro
    const registerUsername = document.querySelector(".container-form.register input[type='text']").value;
    const registerEmail = document.querySelector(".container-form.register input[type='email']").value;
    const registerPassword = document.querySelector(".container-form.register input[type='password']").value;

    // verifico si el usuario existe
    if (localStorage.getItem(registerEmail)) {
        Swal.fire({
            icon: 'error',
            title: 'Email ya registrado',
            text: 'Por favor intente con otro o inicie sesión',
        })
    } else {
        // guaro el usuario en el LS
        const userData = {
            username: registerUsername,
            password: registerPassword,
        };
        localStorage.setItem(registerEmail, JSON.stringify(userData));
        Swal.fire(
            'Usuario creado con éxito!',
            'Bienvenido',
            'success'
        );
        // muestro el form de inicio de sesión
        showLoginForm();
    }
});

// inicio de sesión
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // obtengo los valores del formulario de inicio de sesión
    const loginEmail = document.querySelector(".container-form.login input[type='email']").value;
    const loginPassword = document.querySelector(".container-form.login input[type='password']").value;

    // chequeo si el usuario existe en LS y si los datos de inicio de sesión son corrects
    const userData = JSON.parse(localStorage.getItem(loginEmail));
    if (userData && userData.password === loginPassword) {

        window.location.href = "/pages/cotizador.html";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Mail o contraseña incorrectos',
            text: 'Por favor intente nuevamente',
        })
    }
});

// fn para mostrar el form de inicio de sesión y ocultar el de registro
function showLoginForm() {
    const registerContainer = document.querySelector(".container-form.register");
    const loginContainer = document.querySelector(".container-form.login");

    registerContainer.classList.add("hide");
    loginContainer.classList.remove("hide");
}

// fn para mostrar el formulario de registro y ocultar el de inicio de sesión
function showRegisterForm() {
    const registerContainer = document.querySelector(".container-form.register");
    const loginContainer = document.querySelector(".container-form.login");

    registerContainer.classList.remove("hide");
    loginContainer.classList.add("hide");
}

// obtengo elementos del botón "Iniciar Sesión" y "Registrarse" + event listeners
const signInButton = document.getElementById("sign-in");
const signUpButton = document.getElementById("sign-up");

signInButton.addEventListener("click", showLoginForm);
signUpButton.addEventListener("click", showRegisterForm);