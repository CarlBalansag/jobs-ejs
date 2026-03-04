const Job = require("../models/Job");
const parseVErr = require("../util/parseValidationErr");

const index = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.render("jobs", { jobs });
};

const newJob = (req, res) => {
  res.render("job", { job: null });
};

const createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    await Job.create(req.body);
    res.redirect("/jobs");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
      return res.render("job", { job: null, errors: req.flash("error") });
    }
    return next(e);
  }
};

const editJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!job) {
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }
    res.render("job", { job });
  } catch (e) {
    return next(e);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }
    res.redirect("/jobs");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
      const job = await Job.findById(req.params.id);
      return res.render("job", { job, errors: req.flash("error") });
    }
    return next(e);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.redirect("/jobs");
  } catch (e) {
    return next(e);
  }
};

module.exports = { index, newJob, createJob, editJob, updateJob, deleteJob };
