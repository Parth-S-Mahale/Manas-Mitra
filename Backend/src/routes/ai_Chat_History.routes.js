
const express = require('express');
const router = express.Router();

// --- Middleware Imports ---
const { auth } = require('../middlewares/auth.js');

// --- Controller Imports ---
const {
    sendMessage,
    getUserChatHistory,
    getSingleChatSession,
    deleteChatSession
} = require("../controllers/ai_Chat_History.controller.js");


// =================================================================================================
// --- Protected Routes (require a user to be logged in) ---
// =================================================================================================

/**
 * @route   POST /api/ai-chat/message
 * @desc    Sends a message. Creates a new session if sessionId is omitted.
 * @access  Private
 * @body    { "message": "...", "sessionId": "(optional)", "isAnonymized": boolean (optional) }
 */
router.post('/message', auth, sendMessage);

/**
 * @route   GET /api/ai-chat/history
 * @desc    Gets a list of all past chat sessions for the logged-in user.
 * @access  Private
 */
router.get('/history', auth, getUserChatHistory);

/**
 * @route   GET /api/ai-chat/session/:sessionId
 * @desc    Gets the full message history for a single chat session.
 * @access  Private
 */
router.get('/session/:sessionId', auth, getSingleChatSession);

/**
 * @route   DELETE /api/ai-chat/session/:sessionId
 * @desc    Deletes a specific chat session.
 * @access  Private
 */
router.delete('/session/:sessionId', auth, deleteChatSession);


module.exports = router;
