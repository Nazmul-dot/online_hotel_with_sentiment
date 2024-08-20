const express = require("express");
const router = express.Router();
const Room = require("../models/roomModels");
const Hotel = require("../models/hotelModel");
const multer = require("multer");
const fs = require("fs");
const { log } = require("console");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder where the uploaded files will be saved
    cb(null, "uploadhotels/"); // You can change 'uploads/' to your desired folder
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create a Multer instance with the configured storage
const upload = multer({ storage: storage });

// router.post("/addHotel", async (req, res) => {
//   res.send(req.body);
//   console.log(req.body);
// });

router.get("/gethotels", async (req, res) => {
//   res.send("hotel from");
  const hotels=await Hotel.find();
  res.send(hotels)
});

// get single hotel
router.get("/singlehotel/:Hotel_code",async(req,res)=>{
    const hotelData = await Hotel.findOne({ Hotel_code: req.params.Hotel_code });
    console.log(hotelData);
    res.send(hotelData)
})

router.post(
  "/addHotel",
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  async (req, res) => {
    // console.log(req.files);
    //   console.log(req.body);
    const { Hotel_Name, Hotel_code, description } = req.body;
    console.log(Hotel_Name, Hotel_code, description );

    const { image1, image2, image3 } = req.files;
    console.log(image1, image2, image3);
    const hotelData = await Hotel.findOne({ Hotel_code: Hotel_code });
    console.log(hotelData);

    if (hotelData) {
      return res.send("This data is already existed, check this data again ");
    }
    try {
      // Check if all required fields and files exist
      if (
        Hotel_Name &&
        Hotel_code &&
        description &&
        image1 &&
        image2 &&
        image3
      ) {
        const result = new Hotel({
          Hotel_Name: Hotel_Name,
          Hotel_code: Hotel_code,
          description: description,
          img1: image1 ? image1[0].path : "",
          img2: image2 ? image2[0].path : "",
          img3: image3 ? image3[0].path : "",
        });

        await result.save();
        console.log(result);

        return res.status(200).json(result);
      } else {
        return res.status(404).json({ msg: "plz fill all field" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
