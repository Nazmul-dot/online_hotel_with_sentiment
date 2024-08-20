require('dotenv').config();
const express = require('express')
const app = express()
const cors =require('cors')
const cookieParser = require("cookie-parser")
// const fileUpload = require('express-fileupload')
const multer = require("multer");
require('./db/mongoCon')
const port = process.env.PORT || 8001
// console.log(process.env.KEY);
app.use(cors());
// set cookie
app.use(cookieParser())
// for json data
app.use(express.json())

app.use('/uploads',express.static('uploads'))
app.use('/uploadhotels',express.static('uploadhotels'))



app.use(require('./routes/userRoute'))
app.use(require('./routes/postRoute'))
app.use(require('./routes/bookingRoute'))
app.use(require('./routes/ReviewTest'))
app.use(require('./routes/hotelRoute'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})