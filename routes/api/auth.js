const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Authenticate user
// @access  public
router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if ( !email || !password) {
        return res.status(400).json({msg: 'Please enter all fields'})
    }

    // Retrieve an user from db
    User.findOne({ email }).then(user => {
        
        // Send msg if user doesn't exist
        if (!user) return res.status(400).json({ msg: 'User does not exist!' });

        // Validate password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

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
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));

})

module.exports = router;