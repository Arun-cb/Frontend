import React, { useState } from "react";

const TabLayout = () => {

  const [getactivestate, setactivestate] = useState(false)

  let transformedData = [
    {
      "user_id": -1,
      "chart_type": "Bar",
      "component": "barchart",
      "Margin": [
        {
          "att_id": 49,
          "attr_name": "margin",
          "attr_key": "top",
          "attr_value": "30",
          "user_attr_name": "top margin",
          "default_attr_value": "30",
          "min": "-5",
          "max": "100"
        },
        {
          "att_id": 50,
          "attr_name": "margin",
          "attr_key": "right",
          "attr_value": "20",
          "user_attr_name": "right margin",
          "default_attr_value": "20",
          "min": "-5",
          "max": "100"
        },
        {
          "att_id": 51,
          "attr_name": "margin",
          "attr_key": "left",
          "attr_value": "-5",
          "user_attr_name": "left margin",
          "default_attr_value": "-5",
          "min": "-10",
          "max": "100"
        },
        {
          "att_id": 52,
          "attr_name": "margin",
          "attr_key": "bottom",
          "attr_value": "5",
          "user_attr_name": "bottom margin",
          "default_attr_value": "5",
          "min": "-5",
          "max": "100"
        }
      ],
      "Xaxis1": {
        "Label": [
          {
            "att_id": 53,
            "component": "xaxis1",
            "attr_name": "label",
            "attr_key": "value",
            "attr_value": "",
            "user_attr_name": "label value for xaxis1",
            "default_attr_value": "",
            "min": "",
            "max": ""
          },
          {
            "att_id": 54,
            "component": "xaxis1",
            "attr_name": "label",
            "attr_key": "position",
            "attr_value": "insideBottomRight",
            "user_attr_name": "label position for xaxis1",
            "default_attr_value": "insideBottomRight",
            "min": "",
            "max": ""
          },
          {
            "att_id": 55,
            "component": "xaxis1",
            "attr_name": "label",
            "attr_key": "fontSize",
            "attr_value": "14",
            "user_attr_name": "label fontSize for xaxis1",
            "default_attr_value": "14",
            "min": "10",
            "max": "50"
          },
          {
            "att_id": 56,
            "component": "xaxis1",
            "attr_name": "label",
            "attr_key": "fill",
            "attr_value": "#82ca9d",
            "user_attr_name": "label color for xaxis1",
            "default_attr_value": "#82ca9d",
            "min": "",
            "max": ""
          },
          {
            "att_id": 57,
            "component": "xaxis1",
            "attr_name": "label",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "label angle for xaxis1",
            "default_attr_value": "0",
            "min": "0",
            "max": "90"
          }
        ],
        "Tick": [
          {
            "att_id": 58,
            "component": "xaxis1",
            "attr_name": "tick",
            "attr_key": "fill",
            "attr_value": "#82ca9d",
            "user_attr_name": "text color for xaxis1",
            "default_attr_value": "#82ca9d",
            "min": "",
            "max": ""
          },
          {
            "att_id": 59,
            "component": "xaxis1",
            "attr_name": "tick",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "text angle for xaxis1",
            "default_attr_value": "0",
            "min": "0",
            "max": "90"
          },
          {
            "att_id": 60,
            "component": "xaxis1",
            "attr_name": "tick",
            "attr_key": "fontSize",
            "attr_value": "10",
            "user_attr_name": "text fontSize for xaxis1",
            "default_attr_value": "10",
            "min": "10",
            "max": "50"
          }
        ],
        "Padding": [
          {
            "att_id": 89,
            "component": "xaxis1",
            "attr_name": "padding",
            "attr_key": "left",
            "attr_value": "20",
            "user_attr_name": "space from left xaxis",
            "default_attr_value": "20",
            "min": "10",
            "max": "100"
          },
          {
            "att_id": 90,
            "component": "xaxis1",
            "attr_name": "padding",
            "attr_key": "right",
            "attr_value": "20",
            "user_attr_name": "space from right xaxis",
            "default_attr_value": "20",
            "min": "10",
            "max": "100"
          },
          {
            "att_id": 113,
            "component": "xaxis1",
            "attr_name": "padding",
            "attr_key": "left",
            "attr_value": "10",
            "user_attr_name": "space from left xaxis",
            "default_attr_value": "10",
            "min": "-5",
            "max": "100"
          },
          {
            "att_id": 114,
            "component": "xaxis1",
            "attr_name": "padding",
            "attr_key": "right",
            "attr_value": "10",
            "user_attr_name": "space from right xaxis",
            "default_attr_value": "10",
            "min": "-10",
            "max": "100"
          }
        ],
        "Others": [
          {
            "att_id": 91,
            "component": "xaxis1",
            "attr_name": "dx",
            "attr_key": "value",
            "attr_value": "0",
            "user_attr_name": "text shift along the xaxis for xaxis1",
            "default_attr_value": "0",
            "min": "-10",
            "max": "20"
          },
          {
            "att_id": 92,
            "component": "xaxis1",
            "attr_name": "dy",
            "attr_key": "value",
            "attr_value": "0",
            "user_attr_name": "text shift along the yaxis for xaxis1",
            "default_attr_value": "0",
            "min": "-10",
            "max": "20"
          }
        ]
      },
      "Xaxis2": {
        "Label": [
          {
            "att_id": 61,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "value",
            "attr_value": "KPI Period",
            "user_attr_name": "label value for xaxis2",
            "default_attr_value": "KPI Period",
            "min": "",
            "max": ""
          },
          {
            "att_id": 62,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "position",
            "attr_value": "insideBottomRight",
            "user_attr_name": "label position for xaxis2",
            "default_attr_value": "insideBottomRight",
            "min": "",
            "max": ""
          },
          {
            "att_id": 63,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "fontSize",
            "attr_value": "14",
            "user_attr_name": "label fontSize for xaxis2",
            "default_attr_value": "14",
            "min": "10",
            "max": "50"
          },
          {
            "att_id": 64,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "fill",
            "attr_value": "#ff7f0e",
            "user_attr_name": "label color for xaxis2",
            "default_attr_value": "#ff7f0e",
            "min": "",
            "max": ""
          },
          {
            "att_id": 65,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "label angle for xaxis2",
            "default_attr_value": "0",
            "min": "0",
            "max": "90"
          },
          {
            "att_id": 66,
            "component": "xaxis2",
            "attr_name": "label",
            "attr_key": "dy",
            "attr_value": "-5",
            "user_attr_name": "label shift along the yaxis on the position",
            "default_attr_value": "-5",
            "min": "-10",
            "max": "30"
          }
        ],
        "Tick": [
          {
            "att_id": 67,
            "component": "xaxis2",
            "attr_name": "tick",
            "attr_key": "fill",
            "attr_value": "#1f77b4",
            "user_attr_name": "text color for xaxis2",
            "default_attr_value": "#1f77b4",
            "min": "",
            "max": ""
          },
          {
            "att_id": 68,
            "component": "xaxis2",
            "attr_name": "tick",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "text angle for xaxis2",
            "default_attr_value": "0",
            "min": "0",
            "max": "100"
          },
          {
            "att_id": 69,
            "component": "xaxis2",
            "attr_name": "tick",
            "attr_key": "fontSize",
            "attr_value": "10",
            "user_attr_name": "text fontSize for xaxis2",
            "default_attr_value": "10",
            "min": "10",
            "max": "50"
          }
        ],
        "Others": [
          {
            "att_id": 93,
            "component": "xaxis2",
            "attr_name": "dx",
            "attr_key": "value",
            "attr_value": "0",
            "user_attr_name": "text shift along the xaxis for xaxis2",
            "default_attr_value": "0",
            "min": "-10",
            "max": "20"
          },
          {
            "att_id": 94,
            "component": "xaxis2",
            "attr_name": "dy",
            "attr_key": "value",
            "attr_value": "0",
            "user_attr_name": "text shift along the yaxis for xaxis2",
            "default_attr_value": "0",
            "min": "-10",
            "max": "20"
          }
        ]
      },
      "Yaxis1": {
        "Label": [
          {
            "att_id": 70,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "value",
            "attr_value": "KPI Actuals",
            "user_attr_name": "label value for yaxis1",
            "default_attr_value": "KPI Actuals",
            "min": "",
            "max": ""
          },
          {
            "att_id": 71,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "position",
            "attr_value": "insideMiddle",
            "user_attr_name": "label position for yaxis1",
            "default_attr_value": "insideMiddle",
            "min": "",
            "max": ""
          },
          {
            "att_id": 72,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "fontSize",
            "attr_value": "14",
            "user_attr_name": "label fontSize for yaxis1",
            "default_attr_value": "14",
            "min": "10",
            "max": "50"
          },
          {
            "att_id": 73,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "fill",
            "attr_value": "#ff7f0e",
            "user_attr_name": "label color for yaxis1",
            "default_attr_value": "#ff7f0e",
            "min": "",
            "max": ""
          },
          {
            "att_id": 74,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "angle",
            "attr_value": "-90",
            "user_attr_name": "label angle for yaxis1",
            "default_attr_value": "-90",
            "min": "-90",
            "max": "90"
          },
          {
            "att_id": 75,
            "component": "yaxis1",
            "attr_name": "label",
            "attr_key": "dx",
            "attr_value": "-18",
            "user_attr_name": "label shift along the xaxis on the position",
            "default_attr_value": "-18",
            "min": "-20",
            "max": "10"
          }
        ],
        "Tick": [
          {
            "att_id": 76,
            "component": "yaxis1",
            "attr_name": "tick",
            "attr_key": "fill",
            "attr_value": "#82ca9d",
            "user_attr_name": "text color for yaxis1",
            "default_attr_value": "#82ca9d",
            "min": "",
            "max": ""
          },
          {
            "att_id": 77,
            "component": "yaxis1",
            "attr_name": "tick",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "text angle for yaxis1",
            "default_attr_value": "0",
            "min": "-90",
            "max": "90"
          },
          {
            "att_id": 78,
            "component": "yaxis1",
            "attr_name": "tick",
            "attr_key": "fontSize",
            "attr_value": "10",
            "user_attr_name": "text fontSize for yaxis1",
            "default_attr_value": "10",
            "min": "7",
            "max": "20"
          }
        ],
        "Others": [
          {
            "att_id": 95,
            "component": "yaxis1",
            "attr_name": "dx",
            "attr_key": "value",
            "attr_value": "1",
            "user_attr_name": "text shift along the xaxis for yaxis1",
            "default_attr_value": "1",
            "min": "-10",
            "max": "20"
          },
          {
            "att_id": 96,
            "component": "yaxis1",
            "attr_name": "dy",
            "attr_key": "value",
            "attr_value": "-1",
            "user_attr_name": "text shift along the yaxis for yaxis1",
            "default_attr_value": "-1",
            "min": "-10",
            "max": "20"
          }
        ]
      },
      "Yaxis2": {
        "Label": [
          {
            "att_id": 79,
            "component": "yaxis2",
            "attr_name": "label",
            "attr_key": "value",
            "attr_value": "KPI Actuals",
            "user_attr_name": "label value for yaxis2",
            "default_attr_value": "KPI Actuals",
            "min": "",
            "max": ""
          },
          {
            "att_id": 80,
            "component": "yaxis2",
            "attr_name": "label",
            "attr_key": "position",
            "attr_value": "insideMiddle",
            "user_attr_name": "label position for yaxis2",
            "default_attr_value": "insideMiddle",
            "min": "",
            "max": ""
          },
          {
            "att_id": 81,
            "component": "yaxis2",
            "attr_name": "label",
            "attr_key": "fontSize",
            "attr_value": "14",
            "user_attr_name": "label fontSize for yaxis2",
            "default_attr_value": "14",
            "min": "10",
            "max": "40"
          },
          {
            "att_id": 82,
            "component": "yaxis2",
            "attr_name": "label",
            "attr_key": "fill",
            "attr_value": "#ff7f0e",
            "user_attr_name": "label color for yaxis2",
            "default_attr_value": "#ff7f0e",
            "min": "",
            "max": ""
          },
          {
            "att_id": 83,
            "component": "yaxis2",
            "attr_name": "label",
            "attr_key": "angle",
            "attr_value": "-90",
            "user_attr_name": "label angle for yaxis2",
            "default_attr_value": "-90",
            "min": "-90",
            "max": "90"
          }
        ],
        "Tick": [
          {
            "att_id": 84,
            "component": "yaxis2",
            "attr_name": "tick",
            "attr_key": "fill",
            "attr_value": "#2ca02c",
            "user_attr_name": "text color for yaxis2",
            "default_attr_value": "#2ca02c",
            "min": "",
            "max": ""
          },
          {
            "att_id": 85,
            "component": "yaxis2",
            "attr_name": "tick",
            "attr_key": "angle",
            "attr_value": "0",
            "user_attr_name": "text angle for yaxis2",
            "default_attr_value": "0",
            "min": "-90",
            "max": "90"
          },
          {
            "att_id": 86,
            "component": "yaxis2",
            "attr_name": "tick",
            "attr_key": "fontSize",
            "attr_value": "10",
            "user_attr_name": "text fontSize for yaxis2",
            "default_attr_value": "10",
            "min": "7",
            "max": "30"
          }
        ],
        "Others": []
      },
      "Bar": {
        "AxisBar": [
          {
            "att_id": 87,
            "component": "bar1",
            "attr_name": "label",
            "attr_key": "position",
            "attr_value": "top",
            "user_attr_name": "values position top",
            "default_attr_value": "top",
            "min": "",
            "max": ""
          },
          {
            "att_id": 88,
            "component": "bar1",
            "attr_name": "fill",
            "attr_key": "color",
            "attr_value": "#8884d8",
            "user_attr_name": "data points color",
            "default_attr_value": "#8884d8",
            "min": "",
            "max": ""
          },
          {
            "att_id": 97,
            "component": "bar1",
            "attr_name": "label",
            "attr_key": "fontSize",
            "attr_value": "9",
            "user_attr_name": "bar values fontSize",
            "default_attr_value": "9",
            "min": "9",
            "max": "30"
          },
          {
            "att_id": 111,
            "component": "bar1",
            "attr_name": "background",
            "attr_key": "color",
            "attr_value": "#18358b",
            "user_attr_name": "background color",
            "default_attr_value": "#eee",
            "min": "",
            "max": ""
          },
          {
            "att_id": 112,
            "component": "bar1",
            "attr_name": "barSize",
            "attr_key": "value",
            "attr_value": "12",
            "user_attr_name": "barsize value",
            "default_attr_value": "12",
            "min": "3",
            "max": "25"
          },
          {
            "att_id": 157,
            "component": "bar1",
            "attr_name": "numplace_value",
            "attr_key": "placeval",
            "attr_value": "Thousands",
            "user_attr_name": "Number Place Value",
            "default_attr_value": "Thousands",
            "min": "",
            "max": ""
          }
        ]
      }
    }
  ]

  



  return (
    <div className="col-2 cls-1">
      <div className="cls-11">
        <div className="cls-3">
          <p onClick={() => setactivestate(!getactivestate)}>Main Arron</p>
        </div>
        <div className={`cls-2 ${!getactivestate ? 'cls-22' : ''}`}>
          <p>Arron</p>
          <div className="cls-23">
            <p>Arron3</p>
          </div>
        </div>

        <div className={`cls-2 ${!getactivestate ? 'cls-22' : ''}`}>
          <p>Arron</p>
          <div className="cls-23">
            <p>Arron3</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabLayout