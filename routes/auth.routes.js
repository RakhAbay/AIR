const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    // Validation
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Minimum 6 symbols').isLength({ min: 6 }),
    //check('name', 'Enter your name').exists(),
    //check('surname', 'Enter your surname').exists()
  ],
  async (req, res) => {
    try {
      // Validation result
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect data',
        })
      }

      // Requesting values from frontend
      const { email, password /*, name, surname*/ } = req.body

      // Checking existing user
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' })
      }

      // Hashing password and saving user
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email,
        password: hashedPassword /*name, surname */,
      })
      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

// /api/auth/login
router.post(
  '/login',
  [
    // Validation
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      // Validation result
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему',
        })
      }

      // Requesting values from frontend
      const { email, password } = req.body

      // Finding the user
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      // Checking hashed passwords
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова' })
      }

      // Creating jwtToken and sending it
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'))
      res.json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

module.exports = router
