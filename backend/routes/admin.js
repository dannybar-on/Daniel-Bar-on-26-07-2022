const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
  getFriends,
} = require('../controllers/admin.controller')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)
router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.delete('/:id', deleteUser)
router.patch('/:id', updateUser)
router.get('/friends/:id', getFriends)
router.patch('/friends/:id', addFriend)
router.patch('/friends/remove/:id', removeFriend)

module.exports = router
