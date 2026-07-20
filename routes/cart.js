require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async(req, res) => {
    try{
        const result = await pool.query(
            'select * from cart_items'
        );
        res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});

router.get('/:id', async (req, res) =>{
    const id = req.params.id;
    try{
        const result = await pool.query(
            `select u.first_name||' '||u.last_name as full_name, c.quantity,p.name as product_name, p.price from users u 
            inner join cart_items c on c.user_id = u.id inner join products p on p.id = c.product_id where c.user_id = $1`, 
            [id]
        ); 
        if (result.rows.length === 0){
            return res.status(404).json({
                Message: 'User cart items not found'
            })
        }
        res.json(result.rows);
    } catch(err){
        console.error(err);
       res.status(500).json({Error: 'Database error'})
    }
});


router.post('/', async(req, res) =>{
    const {user_id,
        product_id,
        quantity
    } = req.body;
    try {
        const result = await pool.query(
            `insert into cart_items(user_id, product_id, quantity) values ($1, $2, $3) returning *`, 
            [user_id, product_id, quantity]
        );
        res.status(201).json(result.rows)
    } catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});


router.put('/:user_id/:product_id', async(req, res) => {
    const { user_id, product_id } = req.params;
    const { quantity } = req.body;
    try{
        const result = await pool.query(
            `update cart_items set quantity = $1 where user_id = $2 and product_id = $3 returning * `,
            [quantity, user_id, product_id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({Message: 'Item not found in User cart'})
        }
        res.status(201).json(result.rows)
    } catch(err){
        console.error(err.message)
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});

router.delete('/:user_id/:product_id', async (req, res) => {
    const { user_id, product_id } = req.params;
    try{
        const result = await pool.query(
            'delete from cart_items where user_id = $1 and product_id = $2 returning *', 
            [ user_id, product_id]
        );
        if( result.rows.length === 0 ){
            return res.status(404).json({ message: 'Item not found in user cart'})
        }
        res.status(200).json({message: `Item removed from user's cart`, Item: result.rows[0]})
    } catch(err){
        console.error(err);
        res.status(500).json({ Error: 'Database error'})
    }
})


module.exports = router;