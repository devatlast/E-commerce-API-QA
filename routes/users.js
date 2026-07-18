require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.use(express.json());



router.get('/', async (req, res) => {
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


router.get('/:id', async(req,res )=>{
    const id = req.params.id;
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


router.delete('/:id', async(req, res) => {
    const id = req.params.id;

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
        email
    } = req.body;

    try{
        const result = await pool.query(
            `insert into users (first_name, last_name, email) values($1, $2, $3) returning *`,
            [first_name, last_name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: 'Database error'
        });
    }
});



router.put('/:id', async(req, res) => {
    const id = req.params.id;
    const{
        first_name,
        last_name,
        email
    } = req.body;

    try{
        const result = await pool.query(
            `update users set first_name = $1, last_name =$2, email = $3 where id = $4 RETURNING *`, 
            [first_name, last_name, email, id]
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