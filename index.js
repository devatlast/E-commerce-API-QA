const express = require('express');
const app = express();
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));
app.use(express.json());


const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes);

const cartRoutes = require('./routes/cart');
app.use('/cart', cartRoutes);


app.listen(3000,() => {
    console.log('E-commerce server is running on port 3000');
});
