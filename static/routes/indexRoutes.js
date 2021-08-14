const express = require("express");
const router = express.Router();
const AdminPlan = require("../models/AdminPlan");
const loginRoutes = require("./loginRoutes");

// plan page forward
router.get("/plans", function (req, res) {
  AdminPlan.find({}, function (err, docx) {
    res.render("plans", {
      title: "plans",
      planData: docx,
    });
  }).lean();
});

// update page forward
router.get("/updatePlan/:id", function (req, res) {
  AdminPlan.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("updatePlanAdmin", {
        viewTitle: "Update Task",
        layout: "updatePlanLayout",
        singlePlan: doc,
      });
    }
  }).lean();
});

module.exports = router;
