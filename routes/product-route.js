const router = require('express').Router();
const prods = require('../data/products.json');
const {validateHeader, validateAdmin} = require("../middlewares/auth");

const { nanoid } = require('nanoid');
router.get('/', validateHeader, validateAdmin,(req, res) => {
    //returns all products from the ./data/products.json file
    //console.log(prods)
    //checks if its admin, if not, it will not show the stock,
    console.log(res.query)
    let {name, category, pricePerUnit, stock, min,max} = req.query;
    let filtProds = prods.slice();

    if(name){
        filtProds = prods.filter(p => p.name.toUpperCase().includes(name.toUpperCase()))
    }
    if(category){
        filtProds = prods.filter(p => p.category.toUpperCase().includes(category.toUpperCase()))
    }
    if(pricePerUnit){
        filtProds = prods.filter(p => p.pricePerUnit === pricePerUnit)
    }
    if(min && max){
        filtProds = prods.filter(p => p.pricePerUnit >= min && p.pricePerUnit <= max)
    }
    else{
        if(min){
            filtProds = prods.filter(p => p.pricePerUnit >= min)
        }
        if(max){
            filtProds = prods.filter(p => p.pricePerUnit <= max)
        }
    }
    //if it's not admin, it will not show the stock
    if(!req.admin){
        filtProds = filtProds.map(p => {
            return {
                id: p.id,
                imageUrl: p.imageUrl,
                name: p.name,
                description: p.description,
                unit: p.unit,
                category: p.category,
                pricePerUnit: p.pricePerUnit
            }
        })
    }
    else{
        if(stock){
            filtProds = prods.filter(p => p.stock === stock)
        }
    }

    res.send(filtProds);
});

router.get('/:uid',validateHeader, validateAdmin, (req, res)=>{
    //console.log(typeof (req.params.uid));
    let prod = prods.find(p=>p.uuid === Number(req.params.uid))
    if (!prod){
        res.status(404).send({error: "Product not found [INVALID-ID]"})
        return;
    }
    console.log(typeof (prod))
    if(!req.admin){
        prod = {
            id: prod.id,
            imageUrl: prod.imageUrl,
            name: prod.name,
            description: prod.description,
            unit: prod.unit,
            category: prod.category,
            pricePerUnit: prod.pricePerUnit
        }
    }
    res.send(prod)
})



module.exports = router;
