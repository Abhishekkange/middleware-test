const mongoose = require('mongoose');

const connectToMongoose = () => {
  const uri = "mongodb+srv://NearbyKart_production:vgDxWwhHwhdWkSO0@nearbykart.cpuhqy4.mongodb.net/localecommerce?retryWrites=true&maxPoolSize=20&w=majority";

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connection is successful.");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

// Invoke the function to establish the connection immediately
connectToMongoose();


module.exports = connectToMongoose;