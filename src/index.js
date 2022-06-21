const express = require('express')
const app = express()
const connectToMongoDb = require('../db/database');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Feedback = require('../model/Feedback');
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(cors());
app.use(express.json());

connectToMongoDb();
app.post("/createAccount", async(req, res) => {
    const { name, email, password, phone } =  req.body;
    if(!name || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required"});
    }

    let user = await User.find({ email });
    if(user) {
        return res.status(400).json({ message: "User Already exists"})
    }

    const hashPassword = await bcrypt.hash(password, 100);
    user = await User.create({ name, email, password: hashPassword, phone });
    const accessToken = await jwt.sign({ id: user._id }, "fresh_news_secret_key");
    
    res.status(200).json({ accessToken });
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "All Fields are required"});
    }

    const user = await User.find({ email });
    if(!user) {
        return res.status(404).json({ message: "User not found"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message: "Your email address or password is incorrect"})
    }

    const accessToken = jwt.sign({ id: user_id}, "fresh_news_secret_key");
    res.status(200).json({ accessToken });
})

app.post('/sendFeedback', async(req, res) => {
    const { name, email, phone, description } = req.body;
    if(!name || !email || !phone || !description) {
        return res.status(400).json({ message: "All fields are required"})
    }

    const feedback = await Feedback.create( { name, email, phone, description });
    console.log(feedback);
    res.status(200).json({ message: "You're feedback is sent" })
})

app.listen(5000, () => {
    console.log("Started")
});