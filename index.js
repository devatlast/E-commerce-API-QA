const express = require('express');
const app = express();
const listEndpoints = require('express-list-endpoints');

app.use(express.json());

const categoryRoute = require('./routes/category');
app.use('/category', categoryRoute);

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes);

const cartRoutes = require('./routes/cart');
app.use('/cart', cartRoutes);


app.get('/', (req, res) => {
    res.send('E_commerce API is running')
})

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({error: err.message || 'Internal server error'});
});


if(process.env.NODE_ENV !== 'production'){
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`E_commerce running on port ${PORT}`);
    });
}
module.exports = app;
