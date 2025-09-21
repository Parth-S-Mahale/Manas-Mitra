const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth.js');

const {
    logResourceAccess,
    getAccessHistoryForUser
} = require('../controllers/resource_Access.controller.js');

router.post('/log', auth, logResourceAccess);

router.get('/history', auth, getAccessHistoryForUser);

module.exports = router;

    

