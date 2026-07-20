require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.use(express.json());


router.get('/', async (req, res) => {
    try{
        const result = await pool.query(
            'select p.name as product_name, p.price, p.description, c.name as category from products p inner join categories c on p.category_id = c.id'
        );
        res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const result = await pool.query(
             'select p.name as product_name, p.price, p.description, c.name as category from products p inner join categories c on p.category_id = c.id where p.id = $1', [id]
        );
        res.json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});

router.post('/', async(req, res)=>{
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


router.put('/:id', async(req, res)=>{
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
            'update products set category_id = $1, name = $2, description = $3, price = $4, stock = $5 where id = $6 returning *',[
                category_id, name, description,price, stock, id
            ]
        );
        if(result.rows.length === 0){
            return res.status(404).json({Message: 'Product not found'})
        }
        res.status(201).json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({Error: 'Database error'})
    }
});

router.delete('/:id', async(req, res)=> {
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
        res.json({Success: 'Product removed from list'});
    } catch (err){
        console.error(err);
        res.status(500).json({Error: "Database error"})
    }
});
module.exports = router;