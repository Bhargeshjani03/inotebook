const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/iNotebook';

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Connected to Mongo");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
