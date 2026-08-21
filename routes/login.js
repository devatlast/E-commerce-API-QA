
require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        ' select * from users where email = $1 ', [email]
    );


    const user = result.rows[0]
    if(!user){
        return res.status(401).json({
            message: 'User not found'
        });
    }

     if(user.password !== password) {
        return res.status(401).json({
            message: 'Invalid password'
        });
     }

     const token = jwt.sign({
        id: user.id,
        role: user.role
     }, 

        process.env.JWT_SECRET,
        {
            expiresIn: '30m'
        }

    
);
res.json({ token });

});

module.exports = router;

