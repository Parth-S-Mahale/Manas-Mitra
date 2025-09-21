const AiChatHistory = require("../models/ai_Chat_History.models");
const mongoose = require("mongoose");

/* ==================================================
--- Send a message (Starts a new chat or continues an existing one) ---
==================================================*/
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, isAnonymized } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message content is required." });
    }

    let chatSession;

    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      // Find the existing session to continue the chat
      chatSession = await AiChatHistory.findById(sessionId);
      // Security check: ensure the user owns this session
      if (!chatSession || chatSession.userId.toString() !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Forbidden. You do not have access to this chat session.",
          });
      }
    } else {
      // Create a new chat session if no valid sessionId is provided
      chatSession = new AiChatHistory({
        userId,
        isAnonymized: isAnonymized || false,
        messages: [],
      });
    }

    // Add the user's new message
    chatSession.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // --- Mock AI Response ---
    // In a real application, you would make an API call to an AI service (like Gemini) here.
    // For this example, we'll just simulate a response.
    const aiResponse = {
      role: "assistant",
      content: `This is a simulated AI response to your message: "${message}"`,
      timestamp: new Date(),
    };
    chatSession.messages.push(aiResponse);

    // Update the endedAt timestamp
    chatSession.endedAt = new Date();

    await chatSession.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      chatSession,
      t,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred in the AI chat service.",
      });
  }
};

/* ==================================================
--- Get All Chat Sessions for the Logged-in User ---
==================================================*/
exports.getUserChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all sessions, showing the most recent first.
    // We select only necessary fields to keep the history list lightweight.
    const history = await AiChatHistory.find({ userId })
      .sort({ endedAt: -1 })
      .select("_id startedAt endedAt messages");

    // Optional: Map to create a title from the first message for the frontend
    const formattedHistory = history.map((session) => ({
      _id: session._id,
      title:
        session.messages[0]?.content.substring(0, 50) + "..." || "New Chat",
      startedAt: session.startedAt,
      endedAt: session.endedAt,
    }));

    res.status(200).json({
      success: true,
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat history." });
  }
};

/* ==================================================
--- Get a Single, Full Chat Session ---
==================================================*/
exports.getSingleChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid session ID format." });
    }

    const chatSession = await AiChatHistory.findById(sessionId);

    // Security check: Ensure the session exists and belongs to the logged-in user
    if (!chatSession || chatSession.userId.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden. Chat session not found or access denied.",
        });
    }

    res.status(200).json({
      success: true,
      chatSession,
    });
  } catch (error) {
    console.error("Error fetching single chat session:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat session." });
  }
};

/* ==================================================
--- Delete a Chat Session ---
==================================================*/
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid session ID format." });
    }

    const chatSession = await AiChatHistory.findById(sessionId);

    // Security check
    if (!chatSession || chatSession.userId.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden. Chat session not found or access denied.",
        });
    }

    await AiChatHistory.findByIdAndDelete(sessionId);

    res.status(200).json({
      success: true,
      message: "Chat session deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete chat session." });
  }
};
