require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.use(express.json());


router.get('/', auth, async (req, res) => {
    try{
        const result = await pool.query(
            'select p.name as product_name, p.price, p.description, c.name as category, stock from products p inner join categories c on p.category_id = c.id'
        );
        res.status(200).json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});


router.get('/all', auth, isAdmin, async (req, res) => {
    try{
        const result = await pool.query(
            'select * from products'
        );
        res.status(200).json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try{
        const result = await pool.query(
             'select p.name as product_name, p.price, p.description, c.name as category, stock from products p inner join categories c on p.category_id = c.id where p.id = $1', [id]
        );
        res.status(200).json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});

router.post('/', auth, isAdmin, async(req, res)=>{
    const{
        category_id,
        name, 
        description, 
        price,
        stock
    } = req.body;
    try{
        const result = await pool.query(
            'insert into products (category_id, name, description, price, stock) values ($1, $2, $3, $4, $5) returning *', [category_id, name, description, price, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});


router.put('/:id', auth, isAdmin, async(req, res)=>{
    const id = req.params.id;
    const{
        category_id,
        name,
        description, 
        price,
        stock
    } = req.body;
    try{
        const result = await pool.query(
            'update products set category_id = coalesce($1, category_id), name = coalesce($2, name), description = coalesce($3, description), price = coalesce($4, price), stock = coalesce($5, stock) where id = $6 returning *',[
                category_id || null, name || null, description || null,price || null, stock || null, id
            ]
        );
        if(result.rows.length === 0){
            return res.status(404).json({Message: 'Product not found'})
        }
        res.status(200).json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});

router.delete('/:id', auth, isAdmin,  async(req, res)=> {
    const id = req.params.id;
    try{
        const result = await pool.query(
            'delete from products where id = $1 returning *', [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                Message: "Product not found"
            })
        }
        res.status(204).json({Success: 'Product removed from list'});
    } catch (err){
        console.error(err);
        res.status(500).json({Error: "Database error"})
    }
});
module.exports = router;