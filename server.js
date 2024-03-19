const express = require('express');

const app = express();

const productRoutes = require('./routes/product-route');

const cartRoutes = require('./routes/cart-route');

const authMiddleware = require('./middlewares/auth');

function logger (req, res, next){
    console.log(req)
    next()
}

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Integrated Assignment 3. e-commerce app');
});

app.use('/api/products',logger, productRoutes);
app.use('/api/cart', logger,cartRoutes);

const PORT = 3101;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


