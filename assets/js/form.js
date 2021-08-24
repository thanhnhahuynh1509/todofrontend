
function start() {
    const urlApi = 'https://api-todos-example.herokuapp.com/api'
    handleRedirectLogin();
    handleLogin(urlApi);
    handleRegister(urlApi);
};

start();

function handleRedirectLogin() {
    var btnRedirectLogin = document.querySelector('.rd-login');
    var btnRedirectRegister = document.querySelector('.rd-register');
    var formLogin = document.querySelector('.for-log');
    var formRegister = document.querySelector('.for-res');

    btnRedirectLogin.addEventListener('click', () => {
        formRegister.classList.toggle('display-none-form');
        formLogin.classList.toggle('display-none-form');
    })

    btnRedirectRegister.addEventListener('click', () => {
        formRegister.classList.toggle('display-none-form');
        formLogin.classList.toggle('display-none-form');
    })


}

function handleLogin(urlApi) {

    let loginBtn = document.querySelector('.login');

    loginBtn.addEventListener('click', () => {
        let username = document.querySelector('input[name="username"]').value;
        let password = document.querySelector('input[name="password"]').value;

        let header = new Headers({
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
        });
    
        let optional = {
            method: 'GET',
            headers: header,
            mode: 'cors'
        }
        let endPoint = '/workspaces';

        fetch(urlApi + endPoint, optional)
            .then((response) => {
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('password', password);
                if(response.status == 200) {
                    window.location.replace("workspaces.html");
                } else {
                    let errorMessage = document.querySelector('.error-message');
                    errorMessage.innerHTML = 'Invalid username or password';
                }
            })
            .catch(() => {
                let errorMessage = document.querySelector('.error-message');
                errorMessage.innerHTML = 'Invalid username or password';
            });
    })  
}

function handleRegister(urlApi) {
    let registerBtn = document.querySelector('.register');

    registerBtn.addEventListener('click', () => {
        let username = document.querySelectorAll('input[name="username"]')[1].value;
        let password = document.querySelectorAll('input[name="password"]')[1].value;

        let header = new Headers({
            'Content-Type': 'application/json'
        });

        let data = {
            username: username,
            password: password
        }
    
        let optional = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data),
        }
        let endPoint = '/users';

        fetch(urlApi + endPoint, optional)
            .then((response) => {
                if(response.status == 201) {
                    let successMessage = document.querySelector('.success-message');
                    successMessage.innerHTML = 'Success';
                } else {
                    let successMessage = document.querySelector('.success-message');
                    successMessage.innerHTML = 'failed';
                }
            })
            .catch(() => {
                console.log('failed')
            });
    })
}