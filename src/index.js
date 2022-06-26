const express = require('express')
const app = express()
const connectToMongoDb = require('../db/database');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Feedback = require('../model/Feedback');
const bcrypt = require('bcrypt');
const cors = require('cors');
const News = require('../model/News');

app.use(cors());
app.use(express.json());

connectToMongoDb();
app.post("/createAccount", async(req, res) => {
    const { name, email, password, phone } =  req.body;
    console.log(name, email, password, phone)

    if(!name || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required"});
    }

    
    let user = await User.findOne({ email });
    if(user) {
        return res.status(400).json({ message: "User Already exists"})
    }

    console.log(user);
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    user = await User.create({ name, email, password: hashPassword, phone });
    const accessToken = await jwt.sign({ id: user._id }, "fresh_news_secret_key");
    
    console.log(accessToken);
    console.log(user);
    res.status(200).json({ accessToken });
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "All Fields are required"});
    }
    console.log(email, password);

    const user = await User.find({ email });
    if(!user) {
        return res.status(404).json({ message: "User not found"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message: "Your email address or password is incorrect"})
    }

    const accessToken = jwt.sign({ id: user_id}, "fresh_news_secret_key");
    console.log(accessToken);
    res.status(200).json({ accessToken });
})

app.post('/sendFeedback', async(req, res) => {
    const { name, email, phone, description } = req.body;
    if(!name || !email || !phone || !description) {
        return res.status(400).json({ message: "All fields are required"})
    }

    console.log(name, email, phone, description);
    const feedback = await Feedback.create( { name, email, phone, description });
    console.log(feedback);
    res.status(200).json({ message: "You're feedback is sent" })
})

app.post('/saveArticles', async(req, res) => {
    const { title, description, author, date, imageUrl, url } = req.body;
    if(!title || !description || !author || !date || !imageUrl || !url) {
        return res.status(400).json({ message: "All Fields are required"})
    }

    console.log(title, description, author, date, imageUrl, url);
    const news = await News.create({ title, description, author, date, imageUrl, url });

    console.log(news);
    res.status(200).json({ message: "Article saved successfully"});
})

app.get('/getAllArticles', async(req, res) => {
    const news = await News.find();
    res.status(200).json(news);
})

app.listen(5000, () => {
    console.log("Started")
});