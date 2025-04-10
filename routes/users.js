const User = require("../models/User");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("this is user route");
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    await user.save();
    res.status(200).json({ msg: "User updated", data: user });
  } catch (error) {
    res.status(500).json("this is user route");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
