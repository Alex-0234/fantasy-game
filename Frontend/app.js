import { RemoveSignupWrapper, AppendSignupWrapper, appendUserWrapper, loginWindow, registerWindow} from './DOMCreation.js'

document.addEventListener('DOMContentLoaded', async () => {
    //localStorage.removeItem('token');
    const events = new Emitter();
    const UI = new UIManager(events);
    const Manager = new CharacterManager(events);
    const User = new Auth(events);

    await User.init();

    



    //        [   DOM Elements   ]       //
    




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

        this.events.on('user:register:attempt', (payload) => {
            const { username, password } = payload;
            this.register(username, password);
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, password } = payload;
            this.login(username, password);
        })
        
        this.events.on('user:register', (payload) => {
            
        })
        this.events.on('user:login', (payload) => {
            const {userId, username, token} = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
            localStorage.setItem('token', token);
            events.emit('user:login:success', this.data.username);
        })
        this.events.on('user:logout', () => {
            this.data.userId = null;
            this.data.username = null;
            this.data.token = null;
            localStorage.removeItem('token');
            events.emit('user:logout:success');
        })
    }
    async init() {
        const token = localStorage.getItem('token');
        if (token === null) {
            console.log('No Tokens found');
            this.events.emit('UI:render:buttons'); 
            return;
        }
        try {
            const response = await fetch ('http://127.0.0.1:3000/tokenDecrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            if(response.ok) {
                const data = await response.json(); 
                this.events.emit('user:login', data);
            }
            else {
                localStorage.removeItem('token')
            }
        }
        catch (error) {

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
        this.activeWindow = null;

        this.setupEvents();
    }
    setupEvents() {
        this.events.on('UI:render:buttons', () => {
            const header = document.getElementById('header');
            AppendSignupWrapper(this.events, header);
        })
        this.events.on('UI:open:window', (windowName) => {
            const header = document.getElementById('header');
            if ( windowName === 'login' ) {
                const {form, label1, label2, username, password, button} = loginWindow();
                button.addEventListener('click', (e) => {
                    e.preventDefault();

                    const userVal = username.value;
                    const passVal = password.value;
                    this.events.emit('user:login:attempt', {username: userVal, password: passVal})
                })
                label1.appendChild(username);
                label2.appendChild(password);
                form.append(label1, label2, button);
                this.activeWindow && this.activeWindow.remove();
                this.activeWindow = form;
                document.body.appendChild(form);
            }
            if ( windowName === 'register' ) {
                const {form, label1, label2, username, password, button} = registerWindow();
                button.addEventListener('click', (e) => {
                    e.preventDefault();

                    const userVal = username.value;
                    const passVal = password.value;
                    this.events.emit('user:register:attempt', {username: userVal, password: passVal})
                })
                label1.appendChild(username);
                label2.appendChild(password);
                form.append(label1, label2, button);
                this.activeWindow && this.activeWindow.remove();
                this.activeWindow = form;
                document.body.appendChild(form);
            }
        })
        this.events.on('user:login:success', (payload) => {
            RemoveSignupWrapper();
        
            appendUserWrapper(this.events, payload);
            //
            //this.closeAllWindows();
        });
        this.events.on('open:user', () => {
            
        })
    }
}


class CharacterManager {
    constructor(events) {
        this.events = events;
        this.user = null,
        this.characters = null;

        this.events.on('user:change', (payload) => {
        const { t, p, v } = payload;
        if (v === null) return;

        if (p === 'username') {
            this.loadUser(v);
        }
        console.log(payload);
    })
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


