export function createElement(el, className, text = '', attributes = {}) {
    const element = document.createElement(el);

    if (className) {
        element.classList.add(className);
    }

    element.textContent = text;

    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }

    return element;
}
export function createElementNS(el, className, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', el);
    element.classList.add(className);

    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
    return element;
}



export function RemoveSignupWrapper() {
    const wrapper = document.querySelector('.header-wrapper');
    wrapper && wrapper.remove();
}




export function AppendSignupWrapper(events, container) {
    const wrapper = createElement('div','header-wrapper', '');
    const signinButton = createElement('button','header-button','Sign-in', {
        type: 'button'
    });
    const signupButton = createElement('button','header-button','Sign-up', {
        type: 'button'
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        const open = document.querySelector('.user-form');
        open && open.remove();
        events.emit('UI:render:window', 'register');
    })
    signinButton.addEventListener('click', (e) => {
        e.preventDefault();
        const open = document.querySelector('.user-form');
        open && open.remove();
        events.emit('UI:render:window', 'login');
    })

    wrapper.appendChild(signinButton);
    wrapper.appendChild(signupButton);
    container.appendChild(wrapper);
}




export function AppendUserWindow(){
    const window = createElement('div','user-window','');
    const closeIcon = createElementNS('svg','close-icon', {
        height: '20px',
        width: '20px',
        viewbox: '0 0 24 24',
        fill:'none'
    });
    const path = createElementNS('path', 'close-icon-path',{
        d: 'M18 6L6 18M6 6L18 18',
        stroke: 'white'
    });
    const profileButton = createElement('button', 'user-window-button', 'Profile');
    const settingsButton = createElement('button', 'user-window-button', 'Settings');

    window.append(closeIcon, path, profileButton, settingsButton);
    document.body.appendChild(window);
}




export function appendUserWrapper(events, username) {
    const header = document.getElementById('header');
    const wrapper = createElement('div','wrapper','');
    const user = createElement('div','user-button', username);

    user.addEventListener('click', () => {
        events.emit('UI:render:user-window');
    })

    wrapper.appendChild(user);
    header.appendChild(wrapper);
}





export function loginWindow(events) {
    const loginForm = createElement('form','user-form');
    const closeIcon = createElementNS('svg','close-icon', {
        height: '20px',
        width: '20px',
        viewbox: '0 0 24 24',
        fill:'none'
    });
    const path = createElementNS('path', 'close-icon-path',{
        d: 'M18 6L6 18M6 6L18 18',
        stroke: 'white'
    });
    const usernameLabel = createElement('label', 'input-label', 'Username: ', {
        for: 'username-input'
    })
    const usernameInput = createElement('input','user-input','',{
        id: 'username-input',
        required: true
    });
    const passwordLabel = createElement('label', 'input-label', 'Password: ', {
        for: 'password-input'
    })
    const passwordInput = createElement('input','user-input','',{
        id: 'password-input',
        type: 'password',
        required: true
    });
    const loginButton = createElement('button','signup-button', 'Log-in');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();

        const userVal = usernameInput.value;
        const passVal = passwordInput.value;
        events.emit('user:login:attempt', {username: userVal, password: passVal});
        
    })
    closeIcon.addEventListener('click', () => {
        loginForm.remove();
    })

    usernameLabel.appendChild(usernameInput);
    passwordLabel.appendChild(passwordInput);
    closeIcon.appendChild(path);
    loginForm.append(closeIcon, usernameLabel, passwordLabel, loginButton);
    document.body.appendChild(loginForm);

    return loginForm;
}


export function registerWindow(events) {
    const registerForm = createElement('form','user-form');
    const closeIcon = createElementNS('svg','close-icon', {
        height: '20px',
        width: '20px',
        viewbox: '0 0 24 24',
        fill:'none'
    });
    const path = createElementNS('path', 'close-icon-path',{
        d: 'M18 6L6 18M6 6L18 18',
        stroke: 'white'
    });
    const usernameLabel = createElement('label', 'input-label', 'Username: ', {
        for: 'username-input'
    })
    const usernameInput = createElement('input','user-input','',{
        id: 'username-input',
        required: true
    });
    const passwordLabel = createElement('label', 'input-label', 'Password: ', {
        for: 'password-input'
    })
    const passwordInput = createElement('input','user-input','',{
        id: 'password-input',
        type: 'password',
        required: true
    });
    const registerButton = createElement('button','signup-button', 'Register');

    registerButton.addEventListener('click', (e) => {
        e.preventDefault();

        const userVal = usernameInput.value;
        const passVal = passwordInput.value;
        events.emit('user:register:attempt', {username: userVal, password: passVal});
    })
    closeIcon.addEventListener('click', () => {
        registerForm.remove();
    })

    usernameLabel.appendChild(usernameInput);
    passwordLabel.appendChild(passwordInput);
    closeIcon.appendChild(path);
    registerForm.append(closeIcon, usernameLabel, passwordLabel, registerButton);
    document.body.appendChild(registerForm);

    return registerForm;
}