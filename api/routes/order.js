const express = require('express');
const router = express.Router();


const mongoose = require('mongoose');

const Order = require('../models/order')
const Product = require('../models/products')

router.get('/', (req, res, next) => {
    Order
        .find()
        .populate('product', 'name')
        .select('_id quantity product')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                ordered: docs.map(doc => {
                    return {
                        _id: doc._id,
                        quantity: doc.quantity,
                        product: doc.product,
                        request: {
                            types: 'GET',
                            url: 'http://localhost:4000/order/' + doc._id
                        }
                    }
                }),

            })
        }).catch(err => {
            console.log('err', err)
            res.status(500).json({
                error: err
            })
        })

});
router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            console.log('result', product)
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })

        .then(result => {
            res.status(201).json({
                message: 'Order Stored',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.productId
                },
                request: {
                    types: 'GET',
                    url: 'http://localhost:4000/order/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not Found "
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    types: 'GET',
                    url: 'http://localhost:4000/order/' + order._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })


});

router.delete('/:orderId', (req, res, next) => {
    Order.remove(res.params.orderId).exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })

});

module.exports = router; 