const express = require("express");
const router = express.Router();
const Room = require("../models/roomModels");
const Hotel = require("../models/hotelModel");
const multer = require("multer");
const fs = require('fs');
const { log } = require("console");
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder where the uploaded files will be saved
    cb(null, "uploads/"); // You can change 'uploads/' to your desired folder
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create a Multer instance with the configured storage
const upload = multer({ storage: storage });

// Handle POST request for uploading images

router.get("/getAllRoom", async (req, res) => {
  res.send("all Datat");
});
router.post(
  "/addRoom",
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  async (req, res) => {
    console.log(req.files);
      console.log(req.body);
    const { hotelName,hotelCode,price, type, description, roomnumber } = req.body;

    const { image1, image2, image3 } = req.files;
    const roomData = await Room.findOne({ roomNum: roomnumber });
    const validCode=await Hotel.findOne({Hotel_code:hotelCode});
    console.log(roomData);

    if(roomData){
      return res.status(300).send("This data is already existed, check this data again ")
    }
    if(!validCode){
      return res.status(300).send("Invalid Hotel Code enter");
    }
    try {
      // Check if all required fields and files exist
      if (
        hotelName &&
        hotelCode &&
        price &&
        type &&
        description &&
        roomnumber &&
        image1 &&
        image2 &&
        image3
      ) {
        const result = new Room({
          Hotel_Name:hotelName,
          Hotel_code:hotelCode,
          roomNum: roomnumber,
          price: price,
          type: type,
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
      console.error("Error from add gotel:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);


 router.get("/getRooms",async(req,res)=>{

  const getRoomsData = await Room.find({});
  // console.log(getRoomsData);
  return res.send(getRoomsData)
 })



 router.patch(
  "/updateRoom",
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }]),
  async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const { hotelName, hotelCode, price, type, description, roomnumber } = req.body;
    const { image1, image2, image3 } = req.files;

    try {
      const roomData = await Room.findOne({ roomNum: roomnumber });

      if (roomData) {
        const updateData = {};
        const imagePathsToDelete = [];

        // Add fields to updateData if they exist in the request body
        if (hotelName) updateData.Hotel_Name = hotelName;
        if (hotelCode) updateData.Hotel_code = hotelCode;
        if (price) updateData.price = price;
        if (type) updateData.type = type;
        if (description) updateData.description = description;

        // Handle image uploads
        if (image1) {
          updateData.img1 = image1[0].path;
          imagePathsToDelete.push(roomData.img1);
        }
        if (image2) {
          updateData.img2 = image2[0].path;
          imagePathsToDelete.push(roomData.img2);
        }
        if (image3) {
          updateData.img3 = image3[0].path;
          imagePathsToDelete.push(roomData.img3);
        }

        const updatedRoomData = await Room.findByIdAndUpdate(
          roomData._id.toString(),
          updateData,
          { new: true } // Use { new: true } to get the updated document
        );

        // Delete old images if new ones are uploaded
        imagePathsToDelete.forEach((imagePath) => {
          if (imagePath && fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error('Error deleting image:', err);
              } else {
                console.log('Image deleted successfully:', imagePath);
              }
            });
          }
        });

        return res.send(updatedRoomData);
      } else {
        return res.status(404).send("Room not found");
      }
    } catch (error) {
      console.error("Error finding room by room number:", error);
      return res.status(500).send(error);
    }
  }
);


router.delete("/deleteRoom/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const roomData = await Room.findById(id);

    if (roomData) {
      // Delete associated images
      const imagePaths = [roomData.img1, roomData.img2, roomData.img3];
      imagePaths.forEach((imagePath) => {
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting image:', err);
            } else {
              console.log('Image deleted successfully:', imagePath);
            }
          });
        }
      });

      // Delete the room document
      await Room.findByIdAndDelete(id);
      return res.status(200).send("Room deleted successfully");
    } else {
      return res.status(404).send("Room not found");
    }
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).send(error);
  }
});


router.get("/singleroom/:id",async(req,res)=>{
  const id = req.params.id;
  console.log(id);
  // res.send(id)
  const roomData = await Room.findById({_id:id}); // Use findOne instead of find
 return res.send(roomData)
})




////////////////////// review section/comment section /////////////////////////////
// router.post("/commentOn",async(req,res)=>{
//   console.log(req.body);
//   res.send(req.body)
// })




module.exports = router;
