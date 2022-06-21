const mongoose = require('mongoose');
const DB_URL = "mongodb://localhost:27017/fresh_news"

const connectToMongoDb = async () => {
    try {
        mongoose.connect(DB_URL);

        const db = mongoose.connection;

        db.on('connected', () => {
            console.log("Database is connected");
        })

        db.on('error', (error) => {
            console.log(error);
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToMongoDb