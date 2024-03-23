const router = require('express').Router();
const prods = require('../data/products.json');
const {validateHeader, validateAdmin, validateBody} = require("../middlewares/auth");

const {nanoid} = require('nanoid')
const fs = require('fs')
router.get('/', validateHeader, validateAdmin,(req, res) => {
    //console.log(res.query)
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
    let prod = prods.find(p=>p.uuid == req.params.uid)
    if (!prod){
        res.status(404).send({error: "Bad ID"})
        return;
    }
    //console.log(typeof (prod))
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

router.post('/', validateHeader, validateAdmin, validateBody, (req,res) => {
    if(!req.admin){
        res.status(401).send({error: "Missing Token"})
        return
    }
    let body = req.body
    let {imageUrl, name, description, unit, category, pricePerUnit, stock} = body

    let newProd = {
        uuid: nanoid(4),
        imageUrl: imageUrl,
        name: name,
        description: description,
        unit: unit,
        category: category,
        pricePerUnit: pricePerUnit,
        stock: stock
    }

    prods.push(newProd)

    fs.writeFileSync('./data/products.json', JSON.stringify(prods))
    res.status(201).send(newProd)
})

router.put('/:uid', validateHeader, validateAdmin, validateBody, (req,res)=>{

    let prod = prods.find(p=>p.uuid == req.params.uid)
    if (!prod){
        res.status(404).send({error: "Bad ID"})
        return;
    }

    if(!req.admin){
        res.status(401).send({error: "Missing Token"})
        return
    }

    let body = req.body
    let {imageUrl, name, description, unit, category, pricePerUnit, stock} = body

    prod.imageUrl = imageUrl
    prod.name = name
    prod.description = description
    prod.unit = unit
    prod.category = category
    prod.pricePerUnit = pricePerUnit
    prod.stock = stock

    fs.writeFileSync('./data/products.json', JSON.stringify(prods))
    res.send(prod)
})

router.delete('/:uid', validateHeader, validateAdmin, (req,res)=>{
    if(!req.admin){
        res.status(401).send({error: "Missing Token"})
        return
    }

    let prod = prods.find(p=>p.uuid == req.params.uid)
    if (!prod){
        res.status(404).send({error: "Bad ID"})
        return;
    }

    let index = prods.indexOf(prod)
    prods.splice(index, 1)

    fs.writeFileSync('./data/products.json', JSON.stringify(prods))
    res.status(200).send(prod)
})

module.exports = router;