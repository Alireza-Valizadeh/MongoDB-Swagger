const mongoose = require("mongoose")
const RestuarantSchema = require("../Schemas/restuarants.js")
const mongoDB = require("../../index")
const RestuarantModel = new mongoose.model("Restaurant", RestuarantSchema.RestuarantSchema, "Rests")
const FoodModel = new mongoose.model("Food", RestuarantSchema.FoodSchema, "Foods")

module.exports = {
      RestuarantModel: RestuarantModel, 
      FoodModel: FoodModel
};