const mongoose=require("mongoose");

// Connection URL
const url = 'mongodb+srv://shakil:606845nazmul@cluster0.jjcy2nn.mongodb.net/'
// Connect to the database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error'));

db.once('open', () => {
  console.log('Connected to MongoDB database');
  // Perform your database operations here
});