const express = require('express');
const router = express.Router();
const ldapService = require('../services/ldapService');

router.post('/login', async (req, res) => {
  try {
    const { username, password, costCenter } = req.body;

    if (!username || !password || !costCenter) {
      return res.status(400).json({
        success: false,
        error: 'Username, password and cost center are required'
      });
    }

    const result = await ldapService.authenticate(username, password, costCenter);
    res.json(result);
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
});

module.exports = router;