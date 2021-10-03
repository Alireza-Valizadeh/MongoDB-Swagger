const { validationResult } = require("express-validator")
const logger = require("../Helper/Logger")


function validationError(req, res, next) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
            let text = ""
            for (let object of errors.array()) {
                  text = text + " " + object.param + ": " + object.value + ","
            }
            logger.warn({message: text, label: "Validation Error"})
            return new ErrorBuilder("Validation Error")
            .setIO(true)
            .setDesc("Provided information was not validated successfully")
            .setErrors(errors.array())
            .setHttpCode(400)
            .response(res)
      }
      next()
}

function LimitationError(req, res, next) {
            logger.warn({message: req.connection.remoteAddress + " has requested " + req.path + " too many times.", label: "Limitation Error"})
            return new ErrorBuilder("Limitation Error")
            .setIO(true)
            .setDesc("Too many Requests in a short period of time.")
            .setErrors([{name: "Limitation Error", msg: "Too many Requests in a short period of time. Please try again later"}])
            .setHttpCode(429)
            .response(res)
}
function mongoError(error) {
      try {
            logger.error({message: error.message, label: "Internal server error"})
            return new ErrorBuilder("Internal server error")
            .setIO(false)
            .setDesc("An error occured. Please try again later!")
            .setHttpCode(500)
            .setErrors(error)
            .build()
      }  catch(e) {
            return new ErrorBuilder(e.message)
            .setIO(true)
            .setDesc("mongoDB error")
            .setHttpCode(500)
            .setErrors({error, e})
            .build()
      }
}

function sqlError(error) {
      try {
            logger.error({message: error.originalError.info.message, label: "Internal server error"})
            return new ErrorBuilder("Internal server error")
            .setIO(false)
            .setDesc("An error occured. Please try again later!")
            .setHttpCode(500)
            .setErrors(error)
            .build()
      } catch (e) {
            return new ErrorBuilder(e.message)
            .setIO(true)
            .setDesc("sql error")
            .setHttpCode(500)
            .setErrors({error, e})
            .build()
      }
}

function NotFoundError(req, res, next) {
      logger.warn({message: `${req.path} found no resullt for ${req.connection.remoteAddress}`, label: "404 Not Found"})
      return new ErrorBuilder("Not Found")
      .setIO(true)
      .setDesc("No result found. Please try again!")
      .setHttpCode(404)
      .response(res)
}

class BaseError  { 
      constructor(title, httpCode, errors, description, isOperational) {
            this.title = title;
            this.httpCode = httpCode;
            this.errors = errors;
            this.description = description;
            this.isOperational = isOperational;
      }
}
class ErrorBuilder  {
      errors = [];
      httpCode = 500;
      description = "An error occured";
      isOperational = false;
      constructor(title) {
            this.title = title;
      }
      setErrors(errors) {
            this.errors = errors;
            return this;
      }
      setHttpCode(code) {
            this.httpCode = code;
            return this;
      }
      setDesc(text) {
            this.description = text;
            return this;
      }
      setIO(boolean) {
            this.isOperational = boolean;
            return this;
      }
      build() {
            return new BaseError(this.title, this.httpCode, this.errors, this.description, this.isOperational)
      }
      response(res) {
            return res
            .status(this.httpCode)
            .json(new BaseError(this.title, this.httpCode, this.errors, this.description, this.isOperational))
      }
}

module.exports = {
      validationError: validationError,
      sqlError: sqlError,
      LimitationError: LimitationError,
      mongoError: mongoError,
      NotFoundError: NotFoundError
}