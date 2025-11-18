export function createElement(element, className = null, id = null, {...props}) {
    const el = document.createElement(`${element}`);

    className !== null && el.classList.add(`${className}`);
    id !== null && el.setProperty('id',`${id}`);
    
        Object.entries(props).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

export function RemoveHeaderWrapper() {
    const wrapper = document.getElementById('header-wrapper');
    wrapper && wrapper.remove();
}

export function AppendHeaderWrapper(container) {

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
    const signupWindow = document.getElementById('login-register-form');
    signup.addEventListener('click', (e) => {
        e.preventDefault();
        signupWindow.classList.toggle('hidden');
    })
    signin.addEventListener('click', (e) => {
        e.preventDefault();
        signupWindow.classList.toggle('hidden');
    })

    wrapper.appendChild(signin);
    wrapper.appendChild(signup);
    container.appendChild(wrapper);
}
