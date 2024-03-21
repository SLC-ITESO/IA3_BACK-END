const prods = require('../data/products.json');
function validateHeader(req, res, next){
    let header = req.get('x-token')
    console.log(header)
    if(!header){
        //res.status(403).send({error: "No token"})
        req.token = header
        next()
    }
    else {
        req.token = header
        next()
    }
}

function validateAdmin(req, res, next){
    let pass = "admin2024"
    req.admin = false
    if(req.token === pass){
        req.admin = true
        next()
        return;
    }
    else if(req.token === undefined){
        next()
        return;
    }
    else if(req.token !== pass) {
        res.status(403).send({error: "Bad Token"})
        return;
    }
}

function validateBody(req, res, next){
    let body = req.body
    let tok = req.get('x-token')
    //LIST OF ATRIBUTES IT NEEDS TO HAVE:
    //{ "imageUrl": "string", "name": "string", "description": "string", "unit": "string", "category": "string", "pricePerUnit": 0, "stock": 0 }
    if(!tok){
        res.status(403).send({error: "No token"})
        return;
    }
    //Verifies all components of the body
    console.log(body)
    //orders the body
    let {imageUrl, name, description, unit, category, pricePerUnit, stock} = body
    console.log(imageUrl, name, description, unit, category, pricePerUnit, stock)
    //typeof
    console.log(typeof(imageUrl), typeof(name), typeof(description), typeof(unit), typeof(category), typeof(pricePerUnit), typeof(stock))
    let error = ''
    if(imageUrl == undefined || !imageUrl.trim()){
        error += 'imageUrl is invalid; '
    }
    if(name == undefined || !name.trim()){
        error += 'name is invalid; '
    }
    if(description == undefined || !description.trim()){
        error += 'description is invalid; '
    }
    if(unit == undefined || !unit.trim()){
        error += 'unit is invalid; '
    }
    if(category == undefined || !category.trim()) {
        error += 'category is invalid; '
    }
    if(pricePerUnit == undefined || isNaN(pricePerUnit) || pricePerUnit < 0){
        error += 'pricePerUnit is invalid; '
    }
    if(stock == undefined || isNaN(stock) || stock < 0){
        error += 'stock is invalid; '
    }
    //checks for extra attributes
    for (let key in body){
        if(key !== "imageUrl" && key !== "name" && key !== "description" && key !== "unit" && key !== "category" && key !== "pricePerUnit" && key !== "stock"){
            error += key + ' is not a valid attribute; '
        }
    }
    //checks if there is a duplicated product
    let prod = prods.find(p => p.name == name)
    if(prod){
        error += 'Product already exists'
    }
    //posts error
    if(error){
        res.status(400).send({error})
        return;

    }

    next()
}

module.exports = {validateHeader, validateAdmin, validateBody}