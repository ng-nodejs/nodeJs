const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const productsControllers = require('../controllers/productsControllers')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');

    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);

    } else {
        cb(null, false);

    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
})


router.get('/', productsControllers.getAllProducts);
router.post('/', checkAuth, upload.single('productImage'), productsControllers.saveProduct);
router.get('/:productId', productsControllers.getProductById);
router.patch('/:productId', checkAuth, productsControllers.updateProduct);
router.delete('/:productId', checkAuth, productsControllers.deleteProduct);

module.exports = router; 