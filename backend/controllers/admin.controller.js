const User = require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    const user = await User.findById(id).populate('friends', '_id')
    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ message: 'No such user' })
  }
}

const createUser = async (req, res) => {
  const { email, password, isAdmin } = req.body

  try {
    let emptyFields = []
    if (!email) {
      emptyFields.push('email')
    }
    if (!password) {
      emptyFields.push('password')
    }
    if (!isAdmin) {
      emptyFields.push('isAdmin')
    }
    if (emptyFields.length > 0) {
      console.log(emptyFields)
      return res
        .status(400)
        .json({ error: `Please fill in all the fields`, emptyFields })
    }
    const exists = await User.findOne({ email })
    if (exists) {
      throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({
      email,
      password: hash,
      isAdmin,
    })
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    const user = await User.findByIdAndDelete(id)
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such user' })
    }
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    )
    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const addFriend = async (req, res) => {
  try {
    const { id } = req.params
    const { friendId } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }
    const user = await User.findById(id)
    // check if same user
    if (id === friendId) {
      return res
        .status(400)
        .json({ error: 'You cannot add yourself as a friend' })
    }
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Already friends' })
    }
    await user.updateOne({ $push: { friends: friendId } })
    const friend = await User.findById(friendId)
    if (friend.friends.includes(id)) {
      return res.status(400).json({ error: 'Already friends' })
    }
    await friend.updateOne({ $push: { friends: id } })
    res.status(200).json({ user, friend })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const removeFriend = async (req, res) => {
  try {
    const { id } = req.params
    const { friendId } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }
    const user = await User.findById(id)
    if (id === friendId) {
      return res
        .status(400)
        .json({ error: 'You cannot remove yourself as a friend' })
    }
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Not friends' })
    }
    await user.updateOne({ $pull: { friends: friendId } })
    const friend = await User.findById(friendId)
    if (!friend.friends.includes(id)) {
      return res.status(400).json({ error: 'Not friends' })
    }
    await friend.updateOne({ $pull: { friends: id } })
    res.status(200).json({ user, friend })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

const getFriends = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }
    const user = await User.findById(id).populate('friends', '_id email')
    res.status(200).json(user.friends)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
  getFriends,
}
