const express = require("express")
const mongoose = require("mongoose")
const logger = require("../Helper/Logger")
//sample mongoDB connection boilerplate
mongoose.connect("mongodb://localhost:27017/Rest?readPreference=primary&appname=MongoDB%20Compass&ssl=false", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
}).then((resolve) => {
}).catch((reject) => {
      logger.error("Connection Error")
})
mongoose.connection.on("error", () => {
      logger.warn("Failed initial connection to MongoDB database")
})

mongoose.connection.on("open", () => {
      logger.warn("Successful initial connection to MongoDB database")
})

mongoose.connection.on("close ", () => {
      logger.error({
            label: "Disconnected from MongoDB database", message: `Your app called Connection#close() to disconnect from MongoDB`
      })
})
mongoose.connection.on("disconnected", () => {
      logger.error({
            label: "Disconnected from MongoDB database", message: `Emitted when Mongoose lost connection to the MongoDB server.
       This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.`})
})
module.exports = mongoose.connection;