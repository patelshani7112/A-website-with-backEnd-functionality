const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const clientSession = require("client-sessions");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const db = require("../dbConnect/data-server").MongoURI;
const User = require("../models/User");
const AdminPlan = require("../models/AdminPlan");
const { request } = require("express");
const multer = require("multer");

// for image upload multer

//define storage for the images
const storage = multer.diskStorage({
  //destination for files
  destination: function (req, file, callback) {
    callback(null, "./static/uploads");
  },

  //add back the extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

// client session initialize

router.use(
  clientSession({
    cookieName: "session",
    secret: "week10-eb322",
    duration: 60 * 60 * 1000,
    activeDuration: 2 * 60 * 1000,
  })
);

// cookie session initialize
function sessionCooki(req, res, next) {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect("/");
  }
}

// check if it is user
function isUser(req, res, next) {
  if (req.session.userInfo.adminTypeIs == "User") {
    next();
  } else {
    res.redirect("/");
  }
}

// check if it is admin
function isAdmin(req, res, next) {
  if (req.session.userInfo.adminTypeIs == "Admin") {
    next();
  } else {
    res.redirect("/");
  }
}

// dashboard forward
router.get("/dashboard", sessionCooki, isUser, function (req, res) {
  res.render("dashboard", {
    title: "Welcome",
    layout: "successPage",
    email: req.session.userInfo.email,
    firstName: req.session.userInfo.firstName,
    lastName: req.session.userInfo.lastName,
  });
});

// add plan forward
router.get("/addPlan", sessionCooki, isAdmin, function (req, res) {
  res.render("addPlanAdmin", {
    layout: "addPlanLayout",
  });
});

// forward to checkOutPage
router.get("/checkOutPage", sessionCooki, isUser, function (req, res) {
  res.render("checkOut", {
    layout: "checkOutLayout",
  });
});

// sessionCooki, isUser,
router.get("/checkOutPage/:id", sessionCooki, isUser, function (req, res) {
  AdminPlan.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("checkOut", {
        layout: "checkOutLayout",
        singlePlan: doc,
      });
    }
  }).lean();
});

// admin dashboard
router.get("/adminDashboard", sessionCooki, isAdmin, function (req, res) {
  AdminPlan.find({}, function (err, docx) {
    res.render("adminDashboard", {
      title: "Welcome",
      layout: "adminPage",
      planData: docx,
      email: req.session.userInfo.email,
      firstName: req.session.userInfo.firstName,
      lastName: req.session.userInfo.lastName,
    });
  }).lean();
});

// login
router.get("/login", function (req, res) {
  res.render("login", {
    title: "login",
    layout: "register",
  });
});

// regestration
router.get("/register", function (req, res) {
  res.render("registration", {
    title: "Register",
    layout: "register",
  });
});

// home route
router.get("/", function (req, res) {
  res.render("home", {
    title: "home",
  });
});

// final checkOut call
router.get("/finalCheckOutCall", sessionCooki, isUser, function (req, res) {
  res.render("dashboard", {
    title: "Welcome",
    layout: "successPage",
    email: req.session.userInfo.email,
    firstName: req.session.userInfo.firstName,
    lastName: req.session.userInfo.lastName,
  });
});

// registeration post
router.post(
  "/register",
  check("rFName", "missing firstName ").notEmpty(),
  check("rLName", "missing lastName ").notEmpty(),
  check("rEmail", "missing e-mail ").notEmpty(),
  check("rPhone", "missing phoneNumber ").isNumeric({
    no_symbols: true,
  }),
  check("rAddress", "missing address ").notEmpty(),
  check("rCity", "missing city ").notEmpty(),
  check("rPostal", "missing zipCode ").notEmpty(),
  check("rCountry", "missing country ").notEmpty(),
  check("rpassword", "enter 6 to 12 char passoword.")
    .matches("^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$")
    .isLength({ min: 6, max: 12 }),
  check("rComPasswprd", "Password does not match").notEmpty(),

  function (req, res) {
    let userReg = {
      fName: req.body.rFName,
      lName: req.body.rLName,
      email: req.body.rEmail,
      phone: req.body.rPhone,
      company: req.body.registerCompName,
      address: req.body.rAddress,
      address2: req.body.rAddress2,
      city: req.body.rCity,
      postal: req.body.rPostal,
      country: req.body.rCountry,
      pw: req.body.rpassword,
      confPW: req.body.rComPasswprd,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array();

      let fieldVal = [
        { name: "rFName", valid: "" },
        { name: "rLName", valid: "" },
        { name: "rEmail", valid: "" },
        { name: "rPhone", valid: "" },
        { name: "rAddress", valid: "" },
        { name: "rCity", valid: "" },
        { name: "rPostal", valid: "" },
        { name: "rCountry", valid: "" },
        { name: "rpassword", valid: "" },
        { name: "rComPasswprd", valid: "" },
      ];

      for (let i = 0; i < fieldVal.length; i++) {
        if (errorMsg.some((el) => el.param === fieldVal[i].name)) {
          fieldVal[i].valid = "is-invalid";
        } else {
          fieldVal[i].valid = "is-valid";
        }
      }

      let ErrorPrints = [];
      for (let i = 0; i < errorMsg.length; i++) {
        ErrorPrints[errorMsg[i].param] = errorMsg[i].msg;
      }

      res.render("registration", {
        layout: "register",
        userReg,
        ErrorPrints,
        fieldVal,
      });
    } else {
      let registerErrors = [];

      User.findOne({ email: userReg.email }).then((user) => {
        if (user) {
          registerErrors.push({ msg: "Email is already exixts" });

          res.render("registration", {
            registerErrors,
            layout: "register",
            userReg,
          });
        } else {
          const newUser = new User({
            firstName: userReg.fName,
            lastName: userReg.lName,
            email: userReg.email,
            phoneNumber: userReg.phone,
            companyName: req.body.registerCompName,
            address1: userReg.address,
            address2: userReg.address2,
            city: userReg.city,
            postalCode: userReg.postal,
            country: userReg.country,
            password: userReg.pw,
          });

          bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.session.userInfo = {
                    fname: user.firstName,
                    adminTypeIs: "User",
                  };
                  res.redirect("/dashboard");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    }
  }
);

// login post
router.post(
  "/login",
  [
    check("lUsername", "username must be entered").notEmpty(),
    check("lPassword", "password must be entered").notEmpty(),
  ],
  (req, res) => {
    var userLoginData = {
      email: req.body.lUsername,
      password: req.body.lPassword,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array();
      let emailError = false;
      let passwordError = false;

      if (errorMsg.some((el) => el.param === "lUsername")) {
        emailError = "is-invalid";
      }
      if (errorMsg.some((el) => el.param === "lPassword")) {
        passwordError = "is-invalid";
      }

      res.render("login", {
        errorMsg,
        layout: "register",
        userLoginData: userLoginData,
        emailError,
        passwordError,
      });
    } else if (errors.isEmpty()) {
      let LoginExistErrors = [];

      User.findOne({ email: userLoginData.email }).then((user) => {
        if (!user) {
          LoginExistErrors.push({ msg: "Email is does not exists" });
          res.render("login", {
            LoginExistErrors,
            layout: "register",
            userLoginData: userLoginData,
          });
        } else {
          bcrypt
            .compare(userLoginData.password, user.password)
            .then((isMatched) => {
              if (isMatched == true) {
                console.log("login successfully");
                const userType = "Admin";

                if (user.userType === userType) {
                  req.session.userInfo = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    adminTypeIs: user.userType,
                  };
                  res.redirect("/adminDashboard");
                }
                if (user.userType !== userType) {
                  req.session.userInfo = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    adminTypeIs: user.userType,
                  };
                  res.redirect("/dashboard");
                }
              } else {
                LoginExistErrors.push({ msg: "password does not match" });
                res.render("login", {
                  LoginExistErrors,
                  layout: "register",
                  userLoginData: userLoginData,
                });
              }
            });
        }
      });
    }
  }
);

// add plan post
router.post(
  "/addPlan",
  check("planName", "Plan Name is required").notEmpty(),
  check("planPrice1", "Price1 field is required").notEmpty(),
  check("planPrice12", "Price12 field is required").notEmpty(),
  check("planPrice24", "Price24 field is required").notEmpty(),
  check("planPrice36", "Price36 field is required").notEmpty(),
  check("description", "description is required").notEmpty(),

  upload.single("image"),
  function (req, res) {
    let userReg = {
      planName: req.body.planName,
      planPrice1: req.body.planPrice1,
      planPrice12: req.body.planPrice12,
      planPrice24: req.body.planPrice24,
      planPrice36: req.body.planPrice36,
      description: req.body.description,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array();

      let fieldVal = [
        { name: "planName", valid: "" },
        { name: "planPrice1", valid: "" },
        { name: "planPrice12", valid: "" },
        { name: "planPrice24", valid: "" },
        { name: "planPrice36", valid: "" },
        { name: "description", valid: "" },
      ];

      for (let i = 0; i < fieldVal.length; i++) {
        if (errorMsg.some((el) => el.param === fieldVal[i].name)) {
          fieldVal[i].valid = "is-invalid";
        } else {
          fieldVal[i].valid = "is-valid";
        }
      }

      let ErrorPrints = [];
      for (let i = 0; i < errorMsg.length; i++) {
        ErrorPrints[errorMsg[i].param] = errorMsg[i].msg;
      }

      res.render("addPlanAdmin", {
        layout: "addPlanLayout",
        userReg,
        ErrorPrints,
        fieldVal,
      });
    } else {
      let planErrors = [];

      AdminPlan.findOne({ planName: userReg.planName }).then((user) => {
        if (user) {
          planErrors.push({ msg: "Plan Name must be unique" });

          res.render("addPlanAdmin", {
            planErrors,
            layout: "addPlanLayout",
            userReg,
          });
        } else {
          const newUser = new AdminPlan({
            planName: userReg.planName,
            planPrice1: userReg.planPrice1,
            planPrice12: userReg.planPrice12,
            planPrice24: userReg.planPrice24,
            planPrice36: userReg.planPrice36,
            description: userReg.description,
          }).save((err, data) => {
            if (err) {
              res.status(500).send({
                message:
                  err.message || "Error occurred while a creating operation",
              });
            } else {
              res.redirect("/adminDashboard");
            }
          });
        }
      });
    }
  }
);

// update plan package
router.post("/updatePlanData", (req, res) => {
  if (req.body._id == "") {
    console.log("no id is found");
  } else {
    updateRecord(req, res);
  }
});

function updateRecord(req, res) {
  AdminPlan.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("adminDashboard");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("updatePlanAdmin", {
            viewTitle: "Update Task",
            layout: "updatePlanLayout",
            singlePlan: req.body,
          });
        } else {
          console.log("Error occured in Updating the records" + err);
        }
      }
    }
  );
}

// logout post
router.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/");
});

// delete the account
router.get("/delete/:id", (req, res) => {
  AdminPlan.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/adminDashboard");
    } else {
      console.log("An error occured during the Delete Process" + err);
    }
  });
});

module.exports = router;
