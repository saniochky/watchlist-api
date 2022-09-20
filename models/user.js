const {Schema, model} = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    encryptedPassword: {
        type: String,
        required: true,
    },
    createdDate: {
        type: String,
        default: new Date().toISOString(),
    },
    watchlist: {
        type: [{
            _id: false,
            id: {
                type: Number,
            },
            addedDate: {
                type: String,
            },
        }],
        default: [],
    },
    watched: {
        type: [{
            _id: false,
            id: {
                type: Number,
            },
            liked: {
                type: Boolean,
            },
            addedDate: {
                type: String,
            },
        }],
        default: [],
    },
});

module.exports = model('user', schema);
