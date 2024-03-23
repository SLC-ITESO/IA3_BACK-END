const router = require('express').Router();
const cart = require('../data/cart.json');
const prods = require('../data/products.json');
const {validateHeader, validateAdminder, validateBody, validateUserHeader, validateUserCart} = require("../middlewares/auth");
const fs = require('fs')

router.get('/', (req, res) => {
    res.send(cart);
});
router.post('/', validateUserHeader, (req, res) => {
    let user = req.user
    let cart = req.body

    let error = ''
    cart.forEach(c => {
        if(c.uuid === undefined || !c.uuid.trim()){
            error += 'Invalid uuid; '
        }
        //checks if the uuid exists
        let prod = prods.find(p => p.uuid == c.uuid)
        console.log(prod)
        if(!prod){
            error += 'Invalid uuid; '
            res.status(400).send({error})
        }
        if(isNaN(c.amount) || c.amount < 0){
            error += 'Invalid amount; '
        }
        //checks if the amount exceeds the stock
        if(c.amount > prod.stock || prod.stock < 0){
            error += 'Invalid amount - EXCEEDS STOCK; '
        }

    })

    if(error){
        res.status(400).send({error})
        return;
    }

    let cartFile = require('../data/cart.json')
    let cartUser = cartFile.find(c => c.user == user)
    if(cartUser){
        if(cartUser.cart){
            //checks if the product is already in the cart, if so, it will add the amount
            cart.forEach(c => {
                let prod = cartUser.cart.find(p => p.uuid == c.uuid)
                if(prod){
                    if(c.amount > prod.stock || (c.amount + prod.amount) > prod.stock){
                        res.status(400).send({error: 'Amount exceeds stock'})
                        return;
                    }
                    prod.amount += c.amount
                }
                else {
                    cartUser.cart.push(c)
                }
            })
        }
        else {
            cartUser.cart = cart
        }
    }
    else {
        cartFile.push({user, cart})
    }
    fs.writeFileSync('./data/cart.json', JSON.stringify(cartFile))
    res.send(cartFile)
});


module.exports = router;
