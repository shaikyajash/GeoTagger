const express = require("express");
const passport = require("passport");
const { savePins, getPins } = require("../controller/pin");


const router = express.Router();


router.post("/", passport.authenticate("jwt", { session: false }),savePins);


router.get("/", passport.authenticate("jwt", { session: false }),getPins);



module.exports = router;

