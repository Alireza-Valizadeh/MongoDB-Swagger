class FoodFilter {
      constructor(name, priceMin, priceMax, available) {
            this.name = name;
            this.priceMin = priceMin;
            this.priceMax = priceMax;
            this.available = available;
            this.priceQuery = {$gte: 0, $lte: +Infinity };
            this.query = {price: this.priceQuery};
      }
      getQuery() {
            if (this.name) {
                  let pattern = new RegExp(this.name, "i")
                  this.query["name"] = pattern
            }
            if (this.priceMin) {
                  this.priceQuery["$gte"] = this.priceMin
            }
            if (this.priceMax) {
                  this.priceQuery["$lte"] = this.priceMax
            }
            if (this.available) {
                  this.query["available"] = this.available
            }
            return this.query
      }
}
module.exports = FoodFilter;