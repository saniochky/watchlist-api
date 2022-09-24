const bcrypt = require('bcrypt');
const config = require('config');
const express = require('express');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const loginValidation = require('../validation/login_validation');

const router = express.Router();
const KEY = config.get('jwtSecret');
const SALT = config.get('saltRounds');

router.post('/register', checkBody, register, async (req, res) => {
    res.json({
        'message': 'User created',
    });
});

router.post('/login', checkBody, login, async (req, res) => {
    res.json({
        'message': 'User logged in',
        'token': jwt.sign({
            _id: req.userId,
            encryptedPassword: req.encryptedPassword,
        }, KEY),
    });
});

function checkBody(req, res, next) {
    const body = loginValidation.validate(req.body);

    if (body.error) {
        res.status(400).json({
            'message': body.error.message,
        });
    } else {
        next();
    }
}

async function register(req, res, next) {
    try {
        const username = req.body.username.toLowerCase();
        const existingUser = await userSchema.findOne({username});

        if (existingUser) {
            res.status(400).json({
                'message': 'User with such username already exists',
            });
        } else {
            const user = new userSchema({
                username,
                encryptedPassword: await bcrypt.hashSync(req.body.password, SALT),
            });

            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function login(req, res, next) {
    try {
        const user = await userSchema.findOne({username: req.body.username.toLowerCase()});

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else if (!bcrypt.compareSync(req.body.password, user.encryptedPassword)) {
            res.status(400).json({
                'message': 'Password is incorrect',
            });
        } else {
            req.userId = user._id;
            req.encryptedPassword = user.encryptedPassword;
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

module.exports = router;
