import React from 'react'
import { withFirebase } from '../Firebase'
import './FireChart.css'

import { 
  Line,
  defaults,
} from 'react-chartjs-2'
import "chartjs-plugin-lineheight-annotation"

defaults.global.defaultFontFamily = "'Open Sans', sans-serif"
defaults.global.elements.point.radius = 0
defaults.global.elements.point.hitRadius = 10
defaults.global.elements.point.hoverRadius = 10

const chartOptions = {
  lineHeightAnnotation: {
    always: false,
    hover: true,
    color: "#00000026",
    shadow: false,
    yAxis: 'A',
    noDash: true,
    lineWeight: 5,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        unit: 'hour'
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8.1,
      },
      gridLines: {
        drawOnChartArea: false,
        drawBorder: false,
        display: false,
      }
    }],
    yAxes: [{
      id: 'A',
      position: 'left',
      gridLines: {
        drawOnChartArea: false,
        drawBorder: false,
        display: false,
      },
      ticks: {
        display: false,
        callback: function(value, index, values) {
          return value.toLocaleString("en-US",{style:"currency", currency:"USD"})
        },
        autoSkip: true,
        maxTicksLimit: 5.1,
      },
    }, {
      id: 'B',
      position: 'right',
      gridLines: {
        drawOnChartArea: false,
        drawBorder: false,
        display: false,
      },
      ticks: {
        display: false,
        callback: function (value) {
          const modValue = value / 100
          return modValue.toLocaleString('en-US', {style:'percent', minimumSignificantDigits: 3})
        },
        autoSkip: true,
        maxTicksLimit: 5.1,
      },
    }, {
      id: 'C',
      position: 'right',
      gridLines: {
        drawOnChartArea: false,
        drawBorder: false,
        display: false,
      },
      ticks: {
        display: false,
        callback: function (value) {
          const modValue = value / 100
          return modValue.toLocaleString('en-US', {style:'percent', minimumSignificantDigits: 3})
        },
        autoSkip: true,
        maxTicksLimit: 5.1,
      },
    }]
  }
}

class FireChartBase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lastUpdatedTime: new Date().toString(),
      silverSpotPrice: {
        currentPrice: "0.00"
      },
      silverEaglePrice: {
        currentPrice: "0.00"
      },
      silverEaglePremium: {
        currentPrice: "0.00"
      },
      silverGenericPrice: {
        currentPrice: "0.00"
      },
      silverGenericPremium: {
        currentPrice: "0.00"
      },
      chartLabels: [],
      isSilverSpotShown: true,
      isSilverEagleShown: true,
      isSilverGenericShown: true,
      silverSpotDataSet: {},
      silverEagleDataSet: {},
      silverGenericDataSet: {},
      tooltip: {
        color: 'transparent',
        date: new Date().toLocaleString(),
        value: '$0.00',
      },
    }

  }

  showToolTip = (tooltip) => {
    if (tooltip.dataPoints) {
      const {
        label,
        value,
        datasetIndex,
      } = tooltip.dataPoints[0]

      const tooltipData = {
        color: tooltip.labelColors[0].borderColor,
        date: new Date(label).toLocaleString(),
        value: datasetIndex === 0 
          ? `$${parseFloat(value).toFixed(2)}` 
          : `${parseFloat(value).toFixed(2)}%`
      }
      this.setState({
        tooltip: tooltipData,
      })
    } else {
      let modState = this.state.tooltip
      modState.color = 'transparent'
      this.setState({
        tooltip: modState
      })
    }
  }

  deriveData(newData) {
    delete newData.currentPrice
    const dataKeys = Object.keys(newData)
    const parsedDates = dataKeys.map(date => {
      return new Date(date).toISOString()
    })
    const dataVals = Object.values(newData)
    this.setState({
      chartLabels: parsedDates.filter((item, idx) => idx % 5 === 0 && item)
    })
    return dataVals.filter((item, idx) => idx % 5 === 0 && item)
  }

  datasetKeyProvider() { 
    return btoa(Math.random()).substring(0,12)
  }

  componentDidMount() {
    
    // Last Updated
    this.props.firebase.lastUpdatedTime().on('value', snapshot => {
      this.setState({
        lastUpdatedTime: new Date(snapshot.val()).toLocaleString(),
      })
    })

    // Silver Spot
    this.props.firebase.silverSpotPrice().on('value', snapshot => {
      this.setState({
        silverSpotPrice: snapshot.val(),
        silverSpotDataSet: {
          yAxisID: 'A',
          label: 'Silver Spot Price ($)',
          fill: false,
          lineTension: 0.2,
          borderColor: '#E44722',
          pointBackgroundColor: '#E44722',
          pointBorderWidth: 0,
          data: this.deriveData(snapshot.val())
        }
      })
    })

    // Silver Eagles
    this.props.firebase.silverEaglePrice().on('value', snapshot => {
      this.setState({
        silverEaglePrice: snapshot.val(),
      })
    })
    this.props.firebase.silverEaglePremium().on('value', snapshot => {
      this.setState({
        silverEaglePremium: snapshot.val(),
        silverEagleDataSet: {
          yAxisID: 'B',
          label: 'American Silver Eagle Premium (%)',
          fill: false,
          lineTension: 0.2,
          borderColor: '#64932B',
          pointBackgroundColor: '#64932B',
          pointBorderWidth: 0,
          data: this.deriveData(snapshot.val())
        }
      })
    })

    // Silver Generics
    this.props.firebase.silverGenericPrice().on('value', snapshot => {
      this.setState({
        silverGenericPrice: snapshot.val(),
      })
    })
    this.props.firebase.silverGenericPremium().on('value', snapshot => {
      this.setState({
        silverGenericPremium: snapshot.val(),
        silverGenericDataSet: {
          yAxisID: 'C',
          label: 'Generic Silver Round Premium (%)',
          fill: false,
          lineTension: 0.2,
          borderColor: '#29889D',
          pointBackgroundColor: '#29889D',
          pointBorderWidth: 0,
          data: this.deriveData(snapshot.val())
        }
      })
    })
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.checked
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  determineDataSets = () => {
    const datasets = []
    this.state.isSilverSpotShown && datasets.push(this.state.silverSpotDataSet)
    this.state.isSilverEagleShown && datasets.push(this.state.silverEagleDataSet)
    this.state.isSilverGenericShown && datasets.push(this.state.silverGenericDataSet)
    return datasets
  }

  render() {
    return (
      <div className="page-container">
      <span className="header-title-text"><b>SPOT</b>vs<b>PREMIUM</b></span>
        <div className="prices-grid-container">
            <div>
              <label className="spot-label">
                <input 
                  type="checkbox"
                  name="isSilverSpotShown"
                  checked={this.state.isSilverSpotShown}
                  onChange={this.handleInputChange} />
                Silver Spot Price: <b>${this.state.silverSpotPrice.currentPrice}</b>
              </label>
            </div>
            <div>
              <label className="eagle-label">
                <input 
                  type="checkbox"
                  name="isSilverEagleShown"
                  checked={this.state.isSilverEagleShown}
                  onChange={this.handleInputChange} />
                American Silver Eagle Premium: 
                <b> {this.state.silverEaglePremium.currentPrice}% </b>
                (${this.state.silverEaglePrice.currentPrice})
              </label>
            </div>
            <div>
              <label className="generic-label">
                <input 
                  type="checkbox"
                  name="isSilverGenericShown"
                  checked={this.state.isSilverGenericShown}
                  onChange={this.handleInputChange} />
                Generic Silver Round Premium:
                <b> {this.state.silverGenericPremium.currentPrice}% </b>
                (${this.state.silverGenericPrice.currentPrice})
              </label>
            </div>
        </div>
        <span style={{color: this.state.tooltip.color}} className="tooltip-label"><b>{this.state.tooltip.value}</b></span>
        <span style={{color: this.state.tooltip.color}} className="tooltip-date">{this.state.tooltip.date}</span>
        <div className="chart-container">
          <Line
            datasetKeyProvider={this.datasetKeyProvider}
            options={{
              tooltips: {
                enabled: false,
                custom: this.showToolTip,
              },
              ...chartOptions
            }}
            data={{
              labels: this.state.chartLabels,
              datasets: this.determineDataSets()
            }}
          />
        </div>
        <span className="last-updated-label"><b>Last Updated: {this.state.lastUpdatedTime}</b></span>
      </div>
    )
  }
}

const FireChart = withFirebase(FireChartBase)

export default FireChart