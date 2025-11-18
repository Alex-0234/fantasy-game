import { RemoveHeaderWrapper, AppendHeaderWrapper, createElement } from './DOMCreation.js'

document.addEventListener('DOMContentLoaded', async () => {
    //localStorage.removeItem('token');
    const events = new Emitter();
    const UI = new UIManager(events);
    const User = new Auth(events);
    const Manager = new CharacterManager(events);


    events.on('user:change', (payload) => {
        const { t, p, v } = payload;
        if (v === null) return;

        if (p === 'username') {
            Manager.loadUser(v);
        }
        console.log(payload);
        
    })
    events.on('user:register', (payload) => {
        
    })
    events.on('user:login', (payload) => {
        const {userId, username, token} = payload;
        User.data.userId = userId;
        User.data.username = username;
        User.data.token = token;
        localStorage.setItem('token', token);
        this.events.emit('user:login:success');
    })
    events.on('user:logout', () => {
        User.data.userId = null;
        User.data.username = null;
        User.data.token = null;
        localStorage.removeItem('token');
        this.events.emit('user:logout:success');
    })
    

    await User.init();


    //        [   DOM Elements   ]       //
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');
    const signupWindow = document.getElementById('login-register-form');

    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const usernameValue = document.getElementById('username').value;
        const passwordValue = document.getElementById('password').value;
        User.login(usernameValue, passwordValue);
    })
    registerButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const usernameValue = document.getElementById('username').value;
        const passwordValue = document.getElementById('password').value;
        User.register(usernameValue, passwordValue);
    });

})


//        [    Classes    ]       //

class Emitter {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    emit(event, payload) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => {
                cb(payload);
            })
        } 
    }
}


class Auth {
    constructor(events) {
        this.events = events;

        this.data = new Proxy({userId: null, username: null, token: null}, {
            set: (t, p, v) => {
                t[p] = v;
                events.emit('user:change', {t, p, v});
                return true;
            }
        })
    }
    async init() {
        if (localStorage.getItem('token') !== null) {
            const token = localStorage.getItem('token');
            const response = await fetch ('http://127.0.0.1:3000/tokenDecrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await response.json();
            console.log(data);
            data.token = token;
            if (data !== undefined) {
                this.events.emit('user:login', data);
                localStorage.setItem('token', token);
            }
        }
        else {
            console.log('No Tokens found');
            const header = document.getElementById('header');
            AppendHeaderWrapper(header);
        }
    }
    async register(username, password) {
         const response = await fetch('http://127.0.0.1:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.create) {
            this.login(username, password);
        }
        console.log('Registration response:', data.message);
        
    }
    async login(username, password, token = null) {
        if (username === null ) return;
        if (password === null ) return;
        const response = await fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, token })
         });
        const data = await response.json();

        this.events.emit('user:login', data);
        console.log('Login response:', data.message);

        RemoveHeaderWrapper();
        document.querySelector('#login-register-form').remove()
        
    }
    logout() {
        this.events.emit('user:logout');
        console.log('User logged-out')
    }
    print() {
        console.log(this.user);
    }
}
class UIManager {
    constructor(events) {
        this.events = events;

        events.on('UI:open:window', (windowName) => {
            this.handleWindowOpen(windowName);
        })
        events.on('user:login:success', () => {
            this.closeAllWindows();
        })
    }
}


class CharacterManager {
    constructor(events) {
        this.events = events;
        this.user = null,
        this.characters = null;
    }
    async loadUser(user) {
        const response = await fetch ('http://127.0.0.1:3000/getUserInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user })
        })
        const data = await response.json();
        this.user = data.username;
        this.characters = data.characters;
        console.log('Currently managed user:', this.user);
        console.log('Users characters:', this.characters);
    }
}





class Character {
    constructor(race, characterName, userId) {
        this.userId = userId;
        this.race = race;
        this.name = characterName;
        this.level = 1; 
        this.SP = 10;
        this.stats = 
        {

            HP: 100,
            MP: 100,
            Con: 500,
            Str: 500,
            Dex: 500,
            Int: 500,
            Wis: 500,
        }
        
        
        this.saveCharacter();
    }
    checkRace() {
        if (this.race === 'Human') {
        this.stats = 
        {
            Con: 500,
            Str: 500,
            Dex: 500,
            Int: 500,
            Wis: 500,
        }
        }
        if (race === 'Demon') {
        this.stats = 
        {
            Con: 500,
            Str: 500,
            Dex: 500,
            Int: 500,
            Wis: 500,
        }
        }
        if (race === 'Elf') {
        this.stats = 
        {
            Con: 500,
            Str: 500,
            Dex: 500,
            Int: 500,
            Wis: 500,
        }
        }
        if (race === 'Dragon') {
        this.stats = 
        {
            Con: 500,
            Str: 500,
            Dex: 500,
            Int: 500,
            Wis: 500,
        }

        }
    }
    levelUp() {
        this.level++;
        this.SP += 5;

    }
    async saveCharacter() {
        const response = await fetch ('http://127.0.0.1:3000/createCharacter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  userId: this.userId,
                                    name: this.name,
                                    race: this.race,
                                    level: this.level,
                                    SP: this.SP,
                                    Stats: this.stats
                                    })

        });
        const data = await response.json();
        //console.log('data:',data);
    }
}


