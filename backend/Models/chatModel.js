const mongoose = require('mongoose');

const typeObjectId = mongoose.Schema.Types.ObjectId;

// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin
const chatModel = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [{ type: typeObjectId, ref: 'User' }],
		latestMessage: { type: typeObjectId, ref: 'Message' },
		groupAdmin: { type: typeObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Chat', chatModel);
