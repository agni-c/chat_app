const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline.bold);
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
