const express = require('express');
const prods = require('../data/products.json');
const router = express.Router();

router.get('/api/products', (req, res) => {
    //returns all products from the ./data/products.json file
    //console.log(prods)
    //checks if its admin, if not, it will not show the stock,
    res.send(prods);
});

router.get('/api/products/:uuid', (req, res) => {
    //returns all products from the ./data/products.json file
    console.log(req.params.uuid)
    let product = prods.find(p => p.id === req.params.uuid);
    if (!product) {
        res.status(404).send({ error: "Product not found" });
        return;
    }
    res.send(product);
});

module.exports = router;
