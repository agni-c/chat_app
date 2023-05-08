const mongoose = require('mongoose');

const typeObjectId = mongoose.Schema.Types.ObjectId;

const messageModel = mongoose.Schema(
	{
		sender: { type: typeObjectId, ref: 'User' },
		content: { type: String, trim: true },
		chat: { type: typeObjectId, ref: 'Chat' },
		isRead: { type: Boolean, default: false },
		readBy: [{ type: typeObjectId, ref: 'User' }]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message', messageModel);
