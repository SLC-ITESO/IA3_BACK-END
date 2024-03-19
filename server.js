const express = require('express');

const app = express();

const productRoutes = require('./routes/product-route');

const cartRoutes = require('./routes/cart-route');

const authMiddleware = require('./middlewares/auth');

app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
    res.send('Integrated Assignment 3. e-commerce app');
});

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

const PORT = 3101;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


