const express = require("express")
const mongoose = require("mongoose")
const swaggerUI = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")
const SwaggerOptions = require("./Configs/swagger")
const mainRouter = require("./Routes/main")
const bodyParser = require("body-parser")
const swaggerSpec = swaggerJsdoc(SwaggerOptions);
const Models = require("./MongoDB/Models/restuarants")
const app = express()
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));

mongoose.connect("mongodb://localhost:27017/Rest?readPreference=primary&appname=MongoDB%20Compass&ssl=false", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var mongoDB = mongoose.connection


mongoDB.on("error", () => console.log("Failed connection to MongoDB database"));
mongoDB.once("open", () => console.log("Successful connection to MongoDB database"));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(mainRouter)
app.listen(4002, () => {
    console.log("xxxxxxxxxxxxxxx")
})


module.exports = mongoDB;