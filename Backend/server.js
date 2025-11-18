import  express  from 'express';
import { connectDB } from './db.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
dotenv.config();


const saltRounds = 10;
const port = 3000;
const app = express();
const secret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = await connectDB();
const usersCollection = db.collection('users');
const charactersCollection = db.collection('characters');

app.get('/', (req, res) => {
  res.send('Server is running')
});
app.post('/getUserInfo', async (req, res) => {
    try {
        const username = req.body.username;
        //console.log('username',username);
        const user = await usersCollection.findOne({username: username})
        //console.log('1',user);
        const userid = user.userId;
        //console.log('2',userid);
        const characters = await charactersCollection.find({userId: `${userid}`}).toArray();
        //console.log('3',characters);
        res.status(200).json({username, characters}) // Fix
    }
    catch (error) {

    }
})

app.post('/tokenDecrypt', async (req, res) => {
    try {
        let token = req.body.token;
        const decoded = jwt.verify(token, secret);
        let username = null;
        if(decoded.iat <= decoded.exp) {
            username = decoded.username;
            res.status(200).json({ username, token });
        }
        else {
            username = null;
            token = null;
            res.status(200).json(username, token, {message: 'User token is expired'});
        }
    }
    catch (error) {
        res.status(500);
    }
})
app.post('/login', async (req, res) => {
    try {
        const { username, password, token } = req.body;
        const user = await usersCollection.findOne({ username: username })
        const userPassword = user.password;
        const match = await bcrypt.compare(password, userPassword);
        if (token !== null) {
            res.status(200).json({username, token, message: 'Already Logged-in'})
        }
        else if (match && token === null) {
            const token = jwt.sign(user, secret, { expiresIn: '15m' });
            res.status(200).json({username, token, message: 'Logged-in succesfully'})
        }
        else {
            res.status(401).json({message: "Something isn't matching"});
        }
    }
    catch (error) {
        res.status(500);
    }
})
app.post('/register', async (req, res) => {    
    try {
        let available = null;
        const { username, password } = req.body;
        const exists = await usersCollection.findOne({username: username});

        if (exists === null) {
            available = true;
        } else if (exists){
            available = false;
        }

        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!available) {
            res.status(400).json({ message: 'Username is already taken' })
        }
        else if (
            password.length >= minLength && hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar 
        ){
            const hashedPassword = await bcrypt.hash(password, saltRounds) 
            await usersCollection.insertOne({userId: Date.now(), role: 'user', username: username, password: hashedPassword });
            console.log(`Registered user: ${username}`);
            res.status(201).json({ create: true,  message: 'User registered successfully' });
        }
        else {
            res.status(400).json({ create: false, message: 'User is already registered'});
        }
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/createCharacter', async (req, res) => {
    try {
        const {userId, name, race, level, SP, Stats} = req.body;
        const numberOfCharacters = await charactersCollection.countDocuments({ userId: userId });
        if (numberOfCharacters === 3) {
            res.status(400).json({ error: 'Character limit reached' });
            return;
        } 
        else if (numberOfCharacters <= 2) {
            await charactersCollection.insertOne({  userId: userId,
                                                    name: name,
                                                    race: race,
                                                    level: level,
                                                    SP: SP,
                                                    stats: Stats,
                                                });
        }
        res.status(201).json({ message: 'Character created successfully' });
        
    }
    catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port);