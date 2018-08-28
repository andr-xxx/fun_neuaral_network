const self = this

const workercode = () => {
  const guess = (weights, point) => {
    const sum = point.x * weights.x + point.y * weights.y
    return sum >= 0 ? 1 : -1
  }

  const train = (weights, point, team) => {
    const guessResults = guess(weights, point)
    const error = team - guessResults
    const learningRate = 0.3
    return {
      x: weights.x + point.x * error * learningRate,
      y: weights.y + point.y * error * learningRate
    }
  }

  const __team = (point) => {
    return point.x > point.y ? 1 : -1
  }

  const __rand = (hight, low) => {
    return Math.random() * (hight - low) + low
  }

  self.onmessage = (e) => {
    let currentWeight = {
      x: __rand(-1, 1),
      y: __rand(-1, 1)
    };
    const timer1 = Date.now();
    Array.from({length: 100000000}).forEach(_ => {
      const point = {
        x: __rand(0, 400),
        y: __rand(0, 400)
      };
      currentWeight = train(currentWeight, point, __team(point))
    });
    const timer2 = Date.now();
    console.log(timer2 - timer1)
    self.postMessage(JSON.stringify(currentWeight));
  }
}

let code = workercode.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))

const blob = new Blob([code], {type: "application/javascript"})
const worker_script = URL.createObjectURL(blob)

module.exports = worker_script