const express = require("express")
const mongoose = require("mongoose")
const swaggerUI = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")
const SwaggerOptions = require("./Configs/swagger")
const mainRouter = require("./Routes/main")
const bodyParser = require("body-parser")
const swaggerSpec = swaggerJsdoc(SwaggerOptions);
const Models = require("./MongoDB/Models/restuarants")
const logger = require("./Helper/Logger")
const app = express()
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));
const mongoDB = require("./MongoDB/Connection")

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(mainRouter)


app.listen(4002, () => {
    console.log("xxxxxxxxxxxxxxx")
})


module.exports = mongoDB;