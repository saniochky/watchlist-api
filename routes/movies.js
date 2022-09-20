const express = require('express');
const userSchema = require('../models/user');
const jwtValidation = require('../validation/jwt_validation');
const watchlistValidation = require('../validation/watchlist_movie_validation');
const watchedValidation = require('../validation/watched_movie_validation');

const router = express.Router();

router.get('/', jwtValidation, getMovies, async (req, res) => {
    res.json({
        'watchlist': req.watchlist,
        'watched': req.watched,
    });
});

router.get('/watchlist', jwtValidation, getWatchlist, async (req, res) => {
    res.json({
        'watchlist': req.watchlist,
    });
})

router.patch('/watchlist/add', jwtValidation, addToWatchlist, (...args) => checkBody(args, watchlistValidation), async (req, res) => {
    res.json({
        'message': 'Movie added to watchlist',
    });
});

router.patch('/watchlist/remove', jwtValidation, removeFromWatchlist, (...args) => checkBody(args, watchlistValidation), async (req, res) => {
    res.json({
        'message': 'Movie removed from watchlist',
    });
});

router.get('/watched', jwtValidation, getWatched, async (req, res) => {
    res.json({
        'watched': req.watched,
    });
})

router.patch('/watched/add', jwtValidation, addToWatched, (...args) => checkBody(args, watchedValidation), async (req, res) => {
    res.json({
        'message': 'Movie added to watched',
    });
});

router.patch('/watched/remove', jwtValidation, removeFromWatched, (...args) => checkBody(args, watchedValidation), async (req, res) => {
    res.json({
        'message': 'Movie removed from watched',
    });
});

function checkBody(req, res, next, validator) {
    const body = validator.validate(req.body);

    if (body.error) {
        res.status(400).json({
            'message': body.error.message,
        });
    } else {
        next();
    }
}

async function getMovies(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            req.watchlist = user.watchlist;
            req.watched = user.watched;
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function getWatchlist(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            req.watchlist = user.watchlist;
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function getWatched(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            req.watched = user.watched;
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function addToWatchlist(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            user.watchlist = [...user.watchlist, {...req.body}];
            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function addToWatched(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            user.watched = [...user.watched, {...req.body}];
            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function removeFromWatchlist(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            user.watchlist = [...user.watchlist].filter(movie => movie.id !== req.body.id);
            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

async function removeFromWatched(req, res, next) {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            res.status(400).json({
                'message': 'User not found',
            });
        } else {
            user.watched = [...user.watched].filter(movie => movie.id !== req.body.id);
            await user.save();
            next();
        }
    } catch (e) {
        res.status(500).json({
            'message': 'Internal server error',
        });
    }
}

module.exports = router;
