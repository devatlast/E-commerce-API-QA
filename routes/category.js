require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.use(express.json());


router.get('/', auth, isAdmin, async(req, res) => {
    try{
        const result = await pool.query(
            'select * from categories'
        );
        res.json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Database error'
        })
    }
});

router.post('/', auth, isAdmin, async(req, res) => {
    const { name } = req.body;
    try{
        const result = await pool.query(
            'insert into categories (name) values ($1) returning *', [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({
            message: 'Database error'
        })
    }
});

router.patch('/:id', auth, isAdmin, async(req, res) => {
    const id = req.params.id;
    const {name} = req.body;
    try{
        const result = await pool.query(
            ' update categories set name = $1 where id = $2 returning *', [name, id]
        );
        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Database error'
        })
    }
});

router.delete('/:id', auth, isAdmin, async(req, res) => {
    const id = req.params.id;
    try{
        const result = await pool.query(
            ' delete from categories where id = $1 returning * ', [id]
        );
        if(result.rows.length === 0 ){
            return res.status(404).json({
                message: 'Category not found'
            })
        }
        res.status(200).json({
            message: 'Success: category removed from list'
        })
    } catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Database error'
        })
    }
});


module.exports = router;