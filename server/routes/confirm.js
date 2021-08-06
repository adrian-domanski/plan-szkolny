const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

// Register confirm email
router.get('/email/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego!' });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    if (
      !decoded ||
      !decoded.userId ||
      !decoded.type ||
      decoded.type !== 'REGISTER_CONFIRM'
    ) {
      throw new Error(
        'Potwierdzenie email: Niepoprawny token uwierzytelniający'
      );
    }
    await User.findByIdAndUpdate(
      decoded.userId,
      { confirmed: true },
      { useFindAndModify: false }
    );
    return process.env.NODE_ENV !== 'production'
      ? res.redirect('http://localhost:3000/logowanie')
      : res.redirect('https://www.plan-szkolny.kodario.pl/logowanie');
  } catch (err) {
    return res.status(400).json({ msg: 'Niepoprawny token' });
  }
});

// Change email confirm new one
router.get('/new-email/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu uwierzytelniającego!' });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    if (
      !decoded ||
      !decoded.newEmail ||
      !decoded.userId ||
      !decoded.type ||
      decoded.type !== 'CHANGE_EMAIL_SECOND_STEP'
    ) {
      throw new Error(
        'Potwierdzenie nowego adresu email: Niepoprawny token uwierzytelniający'
      );
    }

    await User.findByIdAndUpdate(
      decoded.userId,
      { email: decoded.newEmail },
      { useFindAndModify: false }
    );
    return res.redirect('http://localhost:3000/logowanie');
  } catch (err) {
    return res.status(400).json({ msg: 'Niepoprawny token' });
  }
});

module.exports = router;
