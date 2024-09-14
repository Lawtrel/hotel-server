const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://lawtrel:AQ9UCPyMjcaBITCk@hoteldb.sy87k.mongodb.net/?retryWrites=true&w=majority&appName=HotelDB',);
        console.log("Conectado! ao MongoDB");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;