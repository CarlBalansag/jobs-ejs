const express = require("express");
const router = express.Router();

const {
  index,
  newJob,
  createJob,
  editJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(index).post(createJob);
router.route("/new").get(newJob);
router.route("/edit/:id").get(editJob);
router.route("/update/:id").post(updateJob);
router.route("/delete/:id").post(deleteJob);

module.exports = router;
