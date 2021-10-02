const { RateLimiter } = require("limiter");
const { LimitationError } = require("../Factories/Error");
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 10000, fireImmediately: true });

async function LimitRequest(req, res, next) {
      const remainingRequests = await limiter.removeTokens(1);
      if (remainingRequests < 0) {
            LimitationError(req, res, next)
      } else {
            next()
      }
}
module.exports = LimitRequest;