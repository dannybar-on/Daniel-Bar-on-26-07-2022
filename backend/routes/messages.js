const express = require('express')
const {
  addMessage,
  getAllMessages,
} = require('../controllers/message,controller')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)
router.post('/', getAllMessages)
router.post('/addmsg', addMessage)

module.exports = router
