export function createElement(element, className = null, id = null) {
    const el = document.createElement(`${element}`);

    className !== null && el.classList.add(`${className}`);
    id !== null && el.setProperty('id',`${id}`);

    return el;
}




export function RemoveSignupWrapper() {
    const wrapper = document.getElementById('header-wrapper');
    wrapper && wrapper.remove();
}




export function AppendSignupWrapper(events, container) {
    const wrapper = document.createElement('div');
    const signin = document.createElement('button');
    const signup = document.createElement('button');
    //
    wrapper.classList.add('wrapper');
    wrapper.setAttribute('id','header-wrapper');
    //
    signin.classList.add('header-button');
    signin.setAttribute('id','signin');
    signin.setAttribute('type','button');
    signin.textContent = 'Signin';
    //
    signup.classList.add('header-button');
    signup.setAttribute('id','signup');
    signup.setAttribute('type','button');
    signup.textContent = 'Signup';
    //
    signup.addEventListener('click', (e) => {
        e.preventDefault();
        const open = document.querySelector('.user-form');
        open && open.remove();
        events.emit('UI:open:window', 'register');
    })
    signin.addEventListener('click', (e) => {
        e.preventDefault();
        const open = document.querySelector('.user-form');
        open && open.remove();
        events.emit('UI:open:window', 'login');
    })

    wrapper.appendChild(signin);
    wrapper.appendChild(signup);
    container.appendChild(wrapper);
}




export function appendUserWrapper(username) {
    const header = document.getElementById('header');
    const wrapper = document.createElement('div');
    const user = document.createElement('div');
    
    wrapper.classList.add('wrapper');
    wrapper.setAttribute('id','header-wrapper');


    user.textContent = `${username}`;
    user.addEventListener('click', () => {
        
    })

    wrapper.appendChild(user);
    header.appendChild(wrapper);
}





export function loginWindow(parent) {
    const loginForm = document.createElement('form');
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const loginButton = document.createElement('button');
    //
    loginForm.classList.add('user-form');

    //
    closeIcon.classList.add('icon');
    closeIcon.addEventListener('click', () => {
        loginForm.remove();
    })
    //
    path.textContent = '';

    //
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'username-input');
    usernameInput.classList.add('user-input');
    usernameInput.setAttribute('id','username-input');

    //
    const label2 = document.createElement('label');
    label2.setAttribute('for', 'password-input');
    passwordInput.classList.add('user-input');
    passwordInput.setAttribute('id','password-input');

    //
    loginButton.classList.add('signup-button');
    loginButton.textContent = 'Login';

    //
    
    closeIcon.appendChild(path);
    loginForm.append(closeIcon);

    return {
        form: loginForm,
        label1 : label1,
        label2 : label2,
        username : usernameInput,
        password : passwordInput,
        button: loginButton
    }
}


export function registerWindow() {
    const registerForm = document.createElement('form');
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const registerButton = document.createElement('button');
    //
    registerForm.classList.add('user-form');

    //
    closeIcon.classList.add('icon');
    closeIcon.addEventListener('click', () => {
        registerForm.remove();
    })

    //
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'username-input')
    usernameInput.classList.add('user-input');
    usernameInput.setAttribute('id','username-input');

    //
    const label2 = document.createElement('label');
    label2.setAttribute('for', 'password-input');
    passwordInput.classList.add('user-input');
    passwordInput.setAttribute('id','password-input');

    //
    registerButton.classList.add('signup-button');
    registerButton.textContent = 'Register';


    //
    closeIcon.appendChild(path);
    
    registerForm.appendChild(closeIcon);

    return {
        form: registerForm,
        label1 : label1,
        label2 : label2,
        username : usernameInput,
        password : passwordInput,
        button: registerButton
    }
}