const { body } = require("express-validator");


exports.productValidator = () => [
    body('title').isString().isLength({min: 3}).trim(),
    // body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isString().isLength({min: 5, max: 400}).trim()
]