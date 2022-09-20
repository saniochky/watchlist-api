const bcrypt = require('bcrypt');
const config = require('config');
const express = require('express');
const userSchema = require('../models/user');
const jwtValidation = require('../validation/jwt_validation');
const passwordValidation = require('../validation/password_validation');

const router = express.Router();
const SALT = config.get('saltRounds');

router.route('/')
    .get(jwtValidation, getUser, async (req, res) => {
        res.json(req.user);
    })
    .patch(jwtValidation, checkBody, changePassword, async (req, res) => {
        res.json({
            'message': 'Password changed',
        });
    })
    .delete(jwtValidation, deleteUser, async (req, res) => {
        res.json({
            'message': 'User deleted',
        });
    });

function checkBody(req, res, next) {
    const body = passwordValidation.validate(req.body);

    if (body.error) {
        res.status(400).json({
            'message': body.error.message,
        });
    } else {
        next();
    }
}

async function getUser(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (user) {
            req.user = {...user};
            next();
        } else {
            res.status(400).json({
                'message': 'User not found',
            });
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function changePassword(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else if (!bcrypt.compareSync(req.body.oldPassword, user.encryptedPassword)) {
            res.status(400).json({
                'message': 'Password is incorrect',
            });
        } else if (passwordValidation.validate(req.body.newPassword).error) {
            res.status(400).json({
                'message': 'New password is invalid',
            });
        } else {
            user.encryptedPassword = bcrypt.hashSync(req.body.newPassword, SALT);
            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function deleteUser(req, res, next) {
    try {
        await userSchema.findByIdAndDelete(req.userId);
        next();
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

module.exports = router;
