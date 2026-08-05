require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.use(express.json());



router.get('/', auth, isAdmin, async (req, res) => {
    try{
        const result = await pool.query(
            'select * from users'
        );
        res.json(result.rows);
    }catch (err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});


router.get('/me', auth,  async(req,res )=>{
    const id = req.user.id;
    try{
        const result = await pool.query(
            `select first_name||' '||last_name as full_name, email, created_at from users where id = $1`,[id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'User not found!'
            });
        }
        res.json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Database Error'});
    }
});


router.delete('/me', auth,  async(req, res) => {
    const id = req.user.id;

    try{
        const result = await pool.query(
            `delete from users where id = $1 RETURNING *`, [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'User not found'
            });    
        }
         res.json({
                message: 'User deleted'
            });    
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: 'Database error'
        })
    }
});




router.post('/', async(req, res) => {
    const {
        first_name,
        last_name,
        email, 
        password
    } = req.body;

    try{
        const result = await pool.query(
            `insert into users (first_name, last_name, email, password) values($1, $2, $3, $4) returning *`,
            [first_name, last_name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: 'Database error'
        });
    }
});



router.put('/:id', auth, isAdmin,  async(req, res) => {
    const id = req.params.id;
    const{
        first_name,
        last_name,
        email, 
        role,
        password
    } = req.body;

    try{
        const result = await pool.query(
            `update users set first_name = $1, last_name =$2, email = $3, role = $4, password = $5 where id = $6 RETURNING *`, 
            [first_name, last_name, email, role,password, id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: 'Database error'
        });
    }
});

module.exports = router;