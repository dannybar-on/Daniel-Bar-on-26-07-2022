const Message = require('../models/messageModel')
const mongoose = require('mongoose')

const addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    })
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ error: 'Failed to send message' })
  }
}

const getAllMessages = async (req, res) => {
  try {
    const { from, to } = req.body
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 })
    const data = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      }
    })
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ error: 'Failed to get messages' })
  }
}

module.exports = {
  addMessage,
  getAllMessages,
}
