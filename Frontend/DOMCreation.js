export function createElement(element, className = null, id = null) {
    const el = document.createElement(`${element}`);

    className !== null && el.classList.add(`${className}`);
    id !== null && el.setProperty('id',`${id}`);

    return el;
}




export function RemoveHeaderWrapper() {
    const wrapper = document.getElementById('header-wrapper');
    wrapper && wrapper.remove();
}




export function AppendHeaderWrapper(events, container) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.setAttribute('id','header-wrapper');
    const signin = document.createElement('button');
    signin.classList.add('header-button');
    signin.setAttribute('id','signin');
    signin.setAttribute('type','button');
    signin.textContent = 'Signin';
    const signup = document.createElement('button');
    signup.classList.add('header-button');
    signup.setAttribute('id','signup');
    signup.setAttribute('type','button');
    signup.textContent = 'Signup';

    const signupWindow = document.getElementById('login-register-form');
    signup.addEventListener('click', (e) => {
        e.preventDefault();
        events.emit('UI:open:window', 'register');
    })
    signin.addEventListener('click', (e) => {
        e.preventDefault();
        events.emit('UI:open:window', 'login');
    })

    wrapper.appendChild(signin);
    wrapper.appendChild(signup);
    container.appendChild(wrapper);
}





export function loginWindow(parent) {
    const window = document.createElement('form');
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const loginButton = document.createElement('button');
    //
    window.classList.add('user-form');

    //
    closeIcon.classList.add('icon');

    //
    path.textContent = '';

    //
    usernameInput.classList.add('user-input');

    //
    passwordInput.classList.add('user-input');

    //
    loginButton.classList.add('signup-button');

    //
    
    closeIcon.appendChild(path);
    window.append(closeIcon, usernameInput, passwordInput, loginButton);
    parent.appendChild(window);
}


export function registerWindow(parent) {
    const window = document.createElement('form');
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const registerButton = document.createElement('button');
    //
    window.classList.add('user-form');

    //
    closeIcon.classList.add('icon');

    //
    usernameInput.classList.add('user-input');

    //
    passwordInput.classList.add('user-input');

    //
    registerButton.classList.add('signup-button');

    //
    closeIcon.appendChild(path);
    window.append(closeIcon, usernameInput, passwordInput, registerButton);
    parent.appendChild(window);
}