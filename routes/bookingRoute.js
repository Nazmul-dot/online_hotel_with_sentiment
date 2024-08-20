const express = require("express");
const router = express.Router();
const Room = require("../models/roomModels");
const BOOKING = require("../models/bookingModels");

router.get("/allBook", async (req, res) => {
  const { email } = req.query;

  try {
    let bookings;
    if (email) {
      bookings = await BOOKING.find({ email });
    } else {
      bookings = await BOOKING.find({});
    }
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post("/bookRoom", async (req, res) => {
  // console.log(req.body);
  const {
    id,
    dates,
    price,
    email,
    phone,
    type,
    roomNumber,
    name,
    hotelName,
    hotelCode,
  } = req.body;
  const roomData = await Room.findById({ _id: id });
  if (!roomData) {
    // Handle the case where the document with the given ID is not found
    return res.status(404).json({ error: "Room not found" });
  }

  const books = new BOOKING({
    name: name,
    email: email,
    phone: phone,
    roomNum: roomNumber,
    price: price,
    type: type,
    time: dates,
    hotelName: hotelName,
    hotelCode: hotelCode,
  });
  const responseBook = await books.save();
  // Create a new time object with the data you want to add
  if (responseBook) {
    const newTimeData = {
      avail: true, // Set to true or false as needed
      times: dates, // Assuming dates is a string representing the time
      userEmail: email, // Set to the appropriate user ID
      userName: name, // Set to the appropriate user name
      userPhone: phone, // Set to the appropriate user phone
      bookingId: responseBook._id,
    };
    roomData.time.push(newTimeData);
    await roomData.save();
    return res.status(200).json(responseBook);
  }
});

// Delete a booking
router.delete("/deleteBooking/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await BOOKING.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Find the room associated with the booking
    const room = await Room.findOne({ "time.bookingId": bookingId });
    if (room) {
      // Remove the booking track from the room's time array
      room.time = room.time.filter(time => time.bookingId.toString() !== bookingId);
      await room.save();
    }

    return res.status(200).json({ message: "Booking and related data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting booking" });
  }
});

router.patch("/confirmBooking/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const bookingConfirm = await BOOKING.findByIdAndUpdate(
      bookingId,
      { confirm: true },
      { new: true }
    );

    if (!bookingConfirm) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json(bookingConfirm);
  } catch (error) {
    return res.status(500).json({ error: "Error confirming booking" });
  }
});

module.exports = router;
