const { response } = require("express");
const { Slot } = require("../model/Slot");

exports.createSlot = async (req, res) => {
  const curUserId = req.user.user._id;
  const data = { ...req.body, wardenId: curUserId };
  try {
    const slot = await new Slot(data);
    const doc = await slot.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.bookSlot = async (req, res) => {
  const curUserId = req.user.user._id;
  const { id } = req.params;
  try {
    const check = await Slot.findById(id);
    if (check.bookedBy) return res.status(400).json({ msg: "already booked" });
    const slot = await Slot.findByIdAndUpdate(
      id,
      { bookedBy: curUserId },
      { new: true } //new true to get updated slot
    );
    res.status(200).json(slot);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.freeSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ bookedBy: null });
    res.status(200).json(slots);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.pendingSession = async (req, res) => {
  const curUserId = req.user.user._id;
  try {
    const slot = await Slot.find({
      wardenId: curUserId,
      bookedBy: { $ne: null },
    }).populate("bookedBy");
    const today = new Date();
    const pendingSlots = slot.filter((s) => {
      const curdate = new Date(s.date + " " + s.time);
      return curdate > today;
    });
    res.status(200).json(pendingSlots);
  } catch (err) {
    res.status(400).json(err);
  }
};
