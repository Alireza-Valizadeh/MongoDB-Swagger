/**
 * @swagger
 * resourcePath: /api
 * /food:
 *   post:
 *     description: Add a food to the database
 *     consumes:
 *       - application/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *                 example: pizza
 *               price:
 *                 type: number
 *                 example: 35
 *               quantity:
 *                 type: number
 *                 description: how many foods are left
 *               image: 
 *                 type: file
 *                 description: path to the img of the food                                              
 *     responses:
 *       201:
 *         description: food successfully created
 * /foods:
 *   get:
 *     description: retrieve foods information
 *     produces: 
 *       - application/json              
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         type: string
 *     responses: 
 *       200:
 *         description: successful
 * /foods/filter:
 *    get:
 *      consumes:
 *        - application/json
 *      produces: 
 *        - application/json
 *      parameters:
 *        - name: name
 *          in: query
 *          schema:
 *            type: pattern(string)
 *          required: false
 *        - name: priceMin
 *          in: query
 *          description: minimum price of the foods
 *          type: number
 *          required: false
 *        - name: priceMax
 *          in: query
 *          description: maximum price of the foods
 *          type: number
 *          required: false
 *        - name: available
 *          in: query
 *          description: status of the food
 *          type: boolean
 *          required: false
 *      responses:
 *        200:
 *         description: successful
 * /restuarant:
 *   post:
 *     description: Add a restuarant 
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *                 example: "رستوران عبدالهی"
 *               opensFrom:
 *                 type: number
 *                 example: 8
 *               closesAt:
 *                 type: number
 *                 example: 24
 *                 description: when the shop closes
 *               image: 
 *                 type: string
 *                 example: ./abdollahi
 *                 description: path to the img of the restaurant
 *               establishedAt: 
 *                 type: Number
 *                 example: 1400
 *               lat:
 *                 type: number
 *                 example: 36
 *                 description: lattitude of the shop
 *               lon:
 *                 type: number
 *                 example: 59
 *                 description: longtitude of the shop                                              
 *     responses:
 *       201:
 *         description: food successfully created            
 * /restuarants:
 *   get:
 *     description: retrieve near restuarnats information
 *     produces: 
 *       - application/json              
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         type: number
 *       - name: lon
 *         in: query
 *         required: true
 *         type: number
 *     responses: 
 *       200:
 *         description: successful
 * /updateRest:
 *   put:
 *     description: update  restuarnat information by its name
 *     produces: 
 *       - application/json              
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newLat: 
 *                 type: number
 *                 example: 36.3212
 *               newLon:
 *                 type: number
 *                 example: 59.21541
 *     responses: 
 *       200:
 *         description: successful 
 * /deleteRest:
 *   delete:
 *     description: delete restuarnat information by its name
 *     produces: 
 *       - application/json              
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *                 example: mytest
 *     responses: 
 *       200:
 *         description: successful 
 *       404:
 *         description: not found 
 *           
 */
const fs = require("fs/promises")
const express = require("express")
const mongoose = require("mongoose")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const FoodFilter = require("../Factories/Filter")
const { FoodModel, RestuarantModel } = require("../MongoDB/Models/restuarants")
const Models = require("../MongoDB/Models/restuarants")
const router = express.Router()

router.post("/food", upload.single("image"), (req, res, next) => {
    const foodModel = new FoodModel({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: Buffer.from(req.file.path),
        available: req.body.quantity != 0
    });
    foodModel.save((err, model) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        fs.
        res.status(201).send(model)
    })
})


router.get("/foods", (req, res, next) => {
    let searchword = ""
    if (req.query.name != undefined) searchword = req.query.name
    var query = searchword != "" ? { name: searchword } : {}
    Models.FoodModel.find(query, 'image').exec((err, docs) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(docs[0].image)
    })
})
router.get("/foods/filter", (req, res, next) => {
    const { name, priceMin, priceMax, available } = req.query;
    const foodFilter = new FoodFilter(name, priceMin, priceMax, available)
    Models.FoodModel.find(foodFilter.getQuery(), 'name price available').exec((err, docs) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(docs)
    })
})

router.post("/restuarant", (req, res, next) => {
    const { name, opensFrom, closesAt, establishedAt, image, lat, lon } = req.body;
    const restuarantModel = Models.RestuarantModel({
        name: name,
        opensFrom: opensFrom,
        closesAt: closesAt,
        establishedAt: establishedAt,
        image: image,
        lat: lat,
        lon: lon
    })
    restuarantModel.save((err, model) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        res.status(201).send(model)
    })
})
router.get("/restuarants", (req, res, next) => {
    const { lat, lon } = req.query;
    RestuarantModel.find({ lat: { $gt: lat - 0.5, $lt: lat - - 0.5 }, lon: { $gt: lon - 0.5, $lt: lon - - 0.5 } }).exec((err, docs) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(docs)
    })
})

router.put("/updateRest", (req, res, next) => {
    const { name } = req.query;
    const { newLat, newLon } = req.body;
    RestuarantModel.findOneAndUpdate({ name: name }, { lat: newLat, lon: newLon }, {
        new: true,
        fields: "name lat lon"
    }).exec((err, docs) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(docs)
    })
})
router.delete("/deleteRest", (req, res, next) => {
    const { name } = req.body;
    RestuarantModel.findOneAndDelete({
        name: name
    }, {
        select: "name"
    }, (err, doc) => {
        if (err) {
            console.log(`Error: ` + err)
            return res.status(500).send(err)
        } else {
            if (!doc) {
                console.log("message")
                return res.status(404).send("NOT FOUND")
            } else {
                res.status(200).send(doc)
            }
        }
    });
})

module.exports = router;