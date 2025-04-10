const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number }, // square footage
    images: { type: Array },
    videoUrl: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    amenities: { type: Array },
    propertyType: { type: String },
    userId: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
