const mongoose = require('mongoose');

const Product = require('../models/products')
const Order = require('../models/order')

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            console.log('docs', docs);
            const respnse = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc.id
                        }
                    }
                })
            }
            res.status(200).json(respnse);
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({ error: err });
        })
}
exports.saveProduct = (req, res, next) => {

    console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log('result', result)
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + result._id

                    }

                }
            })
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({ error: err })
        });

}
exports.getProductById = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id ')
        .exec()
        .then(doc => {
            console.log('From Database :', doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No Result Found'
                });
            }

        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({
                error: err
            });
        })
}
exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps })
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log('doc', doc)
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/products/' + doc._id

                }
            });
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({ error: err });

        })

}
exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log('result', result)
            res.status(200).json({
                message: 'Product deleted'
            });
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({ error: err });
        })

}