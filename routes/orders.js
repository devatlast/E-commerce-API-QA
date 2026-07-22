require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.use(express.json());


router.get('/', async(req, res) => {
    try{
        const result = await pool.query(
            ' select * from orders'
        );
        res.json(result.rows)
    } catch(err){
        console.error(err);
        res.status(500).json({ Error: 'Database error'})
    }
});






router.get('/user/:user_id', async(req, res) => {
    const { user_id } = req.params;
    try{
        const result = await pool.query(
            ' select * from orders where user_id = $1', [user_id]
        );
        if (result.rows.length === 0 ){
            return res.status(404).json({
                Message: 'No orders found for this user'
            });
        }
        res.status(200).json(result.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});



router.get('/:id', async(req, res) => {
    const { id } = req.params;
    try{
        const result = await pool.query(
            ' select * from orders where id = $1', [ id ]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                Message: 'Order not found'
            });
        }
        res.status(200).json(result.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});


router.post('/:user_id', async(req, res)=>{
    const { user_id } = req.params;
    try{
        const cart = await pool.query(
            ' select c.product_id, c.quantity, p.price from cart_items c join products p on c.product_id = p.id where c.user_id = $1', [user_id]
        );
        if(cart.rows.length === 0 ){
            return res.status(404).json({
                Message: 'Cart is empty'
            });
        }

        let total = 0;
        for( const item of cart.rows){
            total += item.price * item.quantity;
        }

        const order = await pool.query(
            ' insert into orders(user_id, total) values ($1, $2) returning *', [user_id, total]
        );

        const orderId = order.rows[0].id;
        for(const item of cart.rows){
            await pool.query(
            `insert into order_items(order_id, product_id, price) values($1, $2, $3)`, 
            [orderId, item.product_id, item.price]);
        };

        await pool.query(
            `delete from cart_items where user_id = $1`, [user_id]
        );
        res.status(201).json({
            message: 'Order created successfully',
            order: order.rows[0]
        });

    } catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        });
    }
});

router.patch('/:id/status', async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try{
        const result = await pool.query(
            ' update orders set status = $1 where id = $2 returning *', [status, id]
        );
        if(result.rows.length === 0 ){
            return res.status(404).json({
                Message: 'Order not found'
            });
        }
        res.status(200).json({
            message: 'Order status updated', 
            order: result.rows[0]
        });
    } catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Database error'
        })
    }
});


module.exports = router;