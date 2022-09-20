const config = require('config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = config.get('port') || 5000;

app.use(express.json({type: '*/*'}));

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);

async function startServer() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

startServer();
