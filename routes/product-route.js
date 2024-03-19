const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Product endpoint');
});

module.exports = router;
