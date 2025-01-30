const Pin  = require('../models/pin');

const savePins = async (req, res) => {
    const userId = req.user.id;
    const pins = req.body.pins; // Expecting an array of pins
  
    try {
      // Optionally, remove existing pins
      await Pin.deleteMany({ user: userId });
  
      // Prepare pins with user reference
      const pinDocs = pins.map(pin => ({
        ...pin,
        user: userId,
      }));
  
      // Insert new pins
      await Pin.insertMany(pinDocs);
  
      res.status(200).json({ message: "Pins saved successfully" });
    } catch (error) {
      console.error("Error saving pins:", error);
      res.status(500).json({ message: "Error saving pins", error: error.message });
    }
  };


  // Get Pins Endpoint
const getPins = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const pins = await Pin.find({ user: userId });
      res.status(200).json({ pins });
    } catch (error) {
      console.error("Error fetching pins:", error);
      res.status(500).json({ message: "Error fetching pins", error: error.message });
    }
  };

  module.exports = {
    savePins,
    getPins,
  };
  