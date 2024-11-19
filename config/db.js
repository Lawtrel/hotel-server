require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONECTARDB,);
        console.log("Conectado! ao MongoDB");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;