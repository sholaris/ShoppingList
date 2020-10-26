const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register New User
// @access  public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({msg: 'Please enter all fields'})
    }

    // Retrieve an user from db
    User.findOne({ email }).then(user => {
        
        // Send msg if user exist
        if (user) return res.status(400).json({ msg: 'User allready exists!' });

        // Create a new user 
        const newUser = new User({
            name,
            email,
            password
        });

        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then(user => {

                    // Generate token for particular user
                    jwt.sign(
                        { id: user.id }, // Payload to sign in
                        config.get('jwtSecret'), // SecretKey
                        { expiresIn: 3600 }, // Options
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        } // Callback func sending user and token
                    )
                })
            })
        })
    })
});

module.exports = router;