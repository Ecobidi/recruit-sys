const multer = require('multer')
const router = require('express').Router()
const UserController = require('../../controllers/user')

const upload = multer({})

router.get('/', UserController.getAllUsersPage)

router.get('/new', UserController.createUserPage)

router.post('/new', upload.single('photo'), UserController.createUser)

router.get('/remove/:serial_number', UserController.removeUser)

module.exports = router