const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/user");
const { signupHandler, loginHandler } = require("../controller/user");

const router = express.Router();

//signup route
router.post("/signup", signupHandler);
router.get("/signup",(req, res)=>{
  return res.render("signup");
})

//login route
router.post("/login", loginHandler);
router.get("/login", (req, res)=>{
 return  res.render("login");
})


router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ success: true , user: req.user});
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});


//exporting
module.exports = router;
