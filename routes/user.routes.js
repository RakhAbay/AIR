const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

router.get(
  '/:id',
  /**/ async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.json(user)
      console.log(user)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)
router.get('/', (req, res) => {
  res.json('please login')
})

module.exports = router
