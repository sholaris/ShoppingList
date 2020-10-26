const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const config = require('config')

// Initialize express
const app = express();

// Bodyparser Middleware 
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    }) // Adding new mongo url parser
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/items', require('./routes/api/Item'));
app.use('/api/users', require('./routes/api/Users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assests if in production
if (process.env.NODE_ENV === 'production') {
    // Set a static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));