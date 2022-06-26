const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('News', NewsSchema);