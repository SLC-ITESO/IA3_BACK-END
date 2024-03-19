function validateHeader(req, res, next){
    let header = req.get('x-auth')
    if(!header){
        res.status(403).send({error: "No token"})
        return
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

    res.status(401).send({error: "Not an admin"})

}

module.exports = {validateHeader, validateAdmin}