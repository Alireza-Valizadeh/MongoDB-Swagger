function LogStackTrace(stack) {
      let firstAtIndex = stack.indexOf("at")
      let secondAtIndex = stack.indexOf("at", firstAtIndex + 1)
      let text =  stack.slice(0, secondAtIndex - 4)
      return text
}
module.exports = LogStackTrace;