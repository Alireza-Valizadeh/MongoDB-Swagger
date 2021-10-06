const mongoose = require("mongoose")

const FoodSchema = new mongoose.Schema({
      name: { type: String, default: "Not set" },
      price: { type: Number, default: 15.00 },
      available: { type: Boolean },
      quantity: { type: Number },
      image: { type: Buffer},
      Rests : [{type: mongoose.Schema.Types.ObjectId, ref: "Rests"}]
})


const RestuarantSchema = new mongoose.Schema({
      name: { type: String, default: "Not set", required: true },
      opensFrom: { type: Number, default: 12 },
      closesAt: { type: Number, default: 24 },
      establishedAt: { type: Number, default: new Date().getFullYear() },
      image: { type: Buffer},
      lat: { type: Number, required: true, min: 0, max: 90 },
      lon: { type: Number, required: true, min: 0, max: 90 },
})
const Rests = mongoose.model('Rests', RestuarantSchema, "Rests");



module.exports = {
      RestuarantSchema: RestuarantSchema,
      FoodSchema: FoodSchema
};