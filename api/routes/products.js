const express = require('express')
const router = express.Router()

const ProductControls = require('../controllers/products')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '_' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.get('/', ProductControls.getAllProducts)

router.post('/', checkAuth, upload.single('productImage'), ProductControls.createNewProduct)

router.get('/:productId', ProductControls.getProductDetails)

router.patch('/:productId', checkAuth, ProductControls.editProduct)

router.delete('/:productId', checkAuth, ProductControls.deleteProduct)

module.exports = router
