const router = require("express").Router();

const Property = require("../models/Property");

//Add a property
router.post("/", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();

    res
      .status(201)
      .json({ message: "property added sucessfully", data: newProperty });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();

    res
      .status(200)
      .json({ message: "properties retrived sucessfully", data: properties });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get property by id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    res
      .status(200)
      .json({ message: "property retrived sucessfully", data: property });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update a property
router.put("/:id", async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res
      .status(200)
      .json({ message: "property Updated sucessfully", data: updatedProperty });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
