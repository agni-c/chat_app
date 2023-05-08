const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const typeObjectId = mongoose.Schema.Types.ObjectId;

const userModel = mongoose.Schema(
	{
		name: { type: String, trim: true, required: true },
		email: { type: String, trim: true, required: true, unique: true },
		password: { type: String, trim: true, required: true },
		pic: {
			type: String,
			default: 'https://img.icons8.com/ios-filled/256/user-male-circle.png'
		}
	},
	{ timestamps: true }
);

userModel.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	// this -> refers to the current document
	this.password = await bcrypt.hash(this.password, salt);
});

userModel.methods.matchPassword = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userModel);
