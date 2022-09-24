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
                default: new Date().toISOString(),
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
                default: true,
            },
            addedDate: {
                type: String,
                default: new Date().toISOString(),
            },
        }],
        default: [],
    },
});

module.exports = model('user', schema);
