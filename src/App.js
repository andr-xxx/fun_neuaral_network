import React from 'react'
import {range} from 'ramda'

import worker_script from './worker';
var myWorker = new Worker(worker_script);

export default class Link extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};
    this.randomPoints = this.__generatePoints(300)
    myWorker.postMessage('lets start')
  }

  componentDidMount() {
    myWorker.onmessage = (m) => {
      this.setState({currentWeight: JSON.parse(m.data)})
    };
  }

  __generatePoints(num) {
    return range(0, num).map(_ => {
      return {
        x: this.__rand(0, 400),
        y: this.__rand(0, 400)
      }
    })
  }

  __rand(hight, low) {
    return Math.random() * (hight - low) + low
  }

  guess(weights, point) {
    const sum = point.x * weights.x + point.y * weights.y
    const team = sum >= 0 ? 1 : -1
    return team
  }

  render() {
    const {currentWeight} = this.state;
    return (
      <div>
        <svg width={400} height={400}>
          {
            currentWeight && this.randomPoints.map(item => (
              <circle
                key={item.x + item.y}
                cx={item.x}
                cy={item.y}
                r={3}
                fill={this.guess(currentWeight, item) > 0 ? 'red' : 'blue'}
              />
            ))
          }
          <line x1={0} y1={0} x2={400} y2={400} stroke='gray'/>
        </svg>
      </div>
    )
  }
}