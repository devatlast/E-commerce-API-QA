const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);
const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes);


app.listen(3000,() => {
    console.log('E-commerce server is running on port 3000');
});