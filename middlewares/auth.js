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
    else{
        //res.status(401).send({error: "Not an admin"})
        next()
        return;
    }
}

function validateBody(req, res, next){
    let body = req.body
    let tok = req.get('x-token')
    //LIST OF ATRIBUTES IT NEEDS TO HAVE:
    //{ "imageUrl": "string", "name": "string", "description": "string", "unit": "string", "category": "string", "pricePerUnit": 0, "stock": 0 }
    //Return status 201 on success, 403 if username is not defined (in x-user).
    //Check for required attributes in the body and return status 400 if missing.
    /*

    Validate that the body contains all the attributes we are interested in; otherwise, return an error status (400). Indicate the list of attributes that are missing or are not valid. You can create a function to validate the attributes, this will be used in the PUT endpoint as well.
    Validate that there are no other product with the same name; otherwise, return an error status (400) with a message indicating that the product already exists.
    Assign a unique identifier (product ID) automatically using nanoid version 3.0.0.
    Save the new product in the array and return status 201 with a message indicating the name of the created product.
    Do not forget to update the products.json file.

     */
    if(!tok){
        res.status(403).send({error: "No token"})
        return;
    }
    //Verifies all components of the body

    //orders the body
    let {imageUrl, name, description, unit, category, pricePerUnit, stock} = body
    let error = ''
    if(imageUrl == undefined || !imageUrl.trim() || imageUrl!==typeof(String)){
        error += 'imageUrl is invalid;\n'
    }
    if(name == undefined || !name.trim() || name!==typeof(String)){
        error += 'name is invalid;\n'
    }
    if(description == undefined || !description.trim() || description!==typeof(String)){
        error += 'description is invalid;\n'
    }
    if(unit == undefined || !unit.trim() || unit!==typeof(String)){
        error += 'unit is invalid;\n'
    }
    if(category == undefined || !category.trim() || category!==typeof(String)) {
        error += 'category is invalid;\n'
    }
    if(pricePerUnit == undefined || isNaN(pricePerUnit) || pricePerUnit < 0 || pricePerUnit!==typeof(Number)){
        error += 'pricePerUnit is invalid;\n'
    }
    if(stock == undefined || isNaN(stock) || stock < 0 || stock!==typeof(Number)){
        error += 'stock is invalid;\n'
    }
    //checks for extra attributes
    for (let key in body){
        if(key !== "imageUrl" && key !== "name" && key !== "description" && key !== "unit" && key !== "category" && key !== "pricePerUnit" && key !== "stock"){
            error += key + ' is not a valid attribute;\n'
        }
    }
    //checks if there is a duplicated product
    let prod = prods.find(p => p.name == name)
    if(prod){
        error += 'Product already exists'
    }
    if(error){
        res.status(400).send({error})
        return;

    }

    next()
}

module.exports = {validateHeader, validateAdmin}