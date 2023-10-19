/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Nov-2022   Priya S      Initial Version             V1

   ** This Page is to define Reusable gauge chart component   **

============================================================================================================================================================*/

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Legend, ResponsiveContainer } from "recharts";
import FnDownloadChartComponent from "../downloadChartComponent";
import domtoimage from "dom-to-image";
import GaugeComponent from 'react-gauge-component'
import { useCurrentPng } from "recharts-to-png";
import { Tooltip } from "react-bootstrap";

const FnGaugeChartComponent = ({ kpi, min, max, target, id, kpiname, updatedattributes, period, exportRestrict }) => {
  let { authTokens, user } = useContext(AuthContext);
  const [chartview, setChartview] = useState([]);
  const [chartview_user, setChartview_user] = useState([]);
  const [gauge, setGauge] = useState();
  const [actualscore, setActualscore] = useState([]);
  const [indicatorcolors, setIndicatorColors] = useState([]);
  const [indicatorcodes, setIndicatorCodes] = useState([]);
  const [ pngaction,setgetpngaction] = useState(false)

  let fnGetChartAttributes = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes/${"gauge"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let view_data = await res.json();

    if (res.status === 200) {
      if (view_data.length > 0) {
        setChartview(view_data);
      }
    }

    let res_user = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes/${user.user_id}/${"gauge"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let view_user_data = await res_user.json();

    if (res_user.status === 200) {
      if (view_user_data.length > 0) {
        setChartview_user(view_user_data);
      }
    }
  };

  let fn_get_kpi_actual_score = async () => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_kpi_dashboard_view/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    let view_data = await res.json();
    let color_code = []
    if (res.status === 200) {
      if (view_data.length > 0) {
        setActualscore(view_data);
        setIndicatorColors(view_data[0]['indicator_colors'].map(d => d.stop_light_indicator));
        view_data[0]['indicator_colors'].map(d => color_code.push({ 'limit': d.stop_light_indicator_to, showTick: true }))
        setIndicatorCodes(color_code)
      }
    }
  };

  let sum_actual = kpi.reduce((a, v) => (a = a + v.actuals), 0);
  let round_data = Math.round(sum_actual / kpi.length);
  let percent_data = round_data / 100;

  // let actualScore = actualscore.filter(actid => actid.id === id).map(actval => actval.actuals)
  let actualScore = actualscore.map(temp => temp.score)
  let actualIndicator = actualscore.map(temp => temp.indicator)

  //--------Chart Attributes for default --------//

  let cust_chartview = Object.create(null);

  chartview.forEach((temp) => {
    cust_chartview[temp.component] = {
      ...cust_chartview[temp.component],
      [temp.attr_name]: {},
    };
  });

  chartview.forEach((temp) => {
    cust_chartview[temp.component][temp.attr_name] = {
      ...cust_chartview[temp.component][temp.attr_name],
      [temp.attr_key]: temp.attr_value,
    };
  });

  //----------Chart Attributes for user---------//

  let cust_chartview_user = Object.create(null);

  chartview_user.forEach((tem) => {
    cust_chartview_user[tem.component] = {
      ...cust_chartview_user[tem.component],
      [tem.attr_name]: {},
    };
  });

  chartview_user.forEach((tem) => {
    cust_chartview_user[tem.component][tem.attr_name] = {
      ...cust_chartview_user[tem.component][tem.attr_name],
      [tem.attr_key]: tem.attr_value,
    };
  });

  //-------------Change attributes to change from default to user--------------//

  let defaultdata = chartview.filter((tem) => tem.user_id === -1);
  let userdata = chartview_user.filter((tem) => tem.user_id);

  defaultdata.forEach((defaul) => {
    let component = defaul.component;
    let attr_name = defaul.attr_name;

    userdata.forEach((user_tem) => {
      let component1 = user_tem.component;
      let attr_name1 = user_tem.attr_name;

      if (component === component1 && attr_name === attr_name1) {
        cust_chartview[defaul.component][defaul.attr_name] = {
          ...cust_chartview_user[user_tem.component][user_tem.attr_name],
          [user_tem.attr_key]: user_tem.attr_value,
        };
      }
    });
  });

  //-----------Convert string to integer values---------------//

  let intger_val = [
    cust_chartview.gaugechart && cust_chartview.gaugechart.pointer,
    cust_chartview.gaugechart && cust_chartview.gaugechart.labels,
    cust_chartview.span && cust_chartview.span.style,
    cust_chartview.gauge1 && cust_chartview.gauge1.style,
  ];

  for (let i = 0; i < intger_val.length; i++) {
    let obj = intger_val[i];
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
        obj[prop] = +obj[prop];
      }
    }
  }

  function getPNG(){
    // console.log(document.getElementById('gauge_chart'))
    // domtoimage
    //   .toPng(document.getElementById("gauge_id"), { bgcolor: "white" })
    //   .then(function (dataUrl) {
    //     setGauge(dataUrl);
    //   });
    // to get .png
    // domtoimage.toPng(document.getElementById('gauge_chart'))
    // .then(function (blob) {
    //     window.saveAs(blob, 'my-node.png');
    // });

    // to get .png
    var node = document.getElementById('gauge_chart');
 
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            // document.body.appendChild(img);
            setGauge(dataUrl)
        })
        .catch(function (error) {
            window.alert('oops, something went wrong!', error);
        });
  }

  useEffect(() => {
    if (updatedattributes)
      setChartview(updatedattributes);
    else
      fnGetChartAttributes();
    // fnPNGDownload();
    fn_get_kpi_actual_score();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if(window){
  //   window.onload(function(){getPNG();})
  // }

  useEffect(() => {
    if(pngaction){
      getPNG();
    }
    // window.addEventListener("load", getPNG);
  }, [pngaction]);
  

  const [getGaugePng, { ref: gaugeRef }] = useCurrentPng();


  return (
    <>
      <div className="bg-white sc_cl_chart_container rounded p-2">
        <div className="sc_cl_chart_export_icon">
          {exportRestrict ? 
            <FnDownloadChartComponent
              onchange={() => setgetpngaction(true)}
              getchartPng={gauge}
              kpi={kpi}
              chart_type={'gauge'}
              chart_name={kpiname}
              id={id}
            />
          : ''}
          {/* <a onClick={fnPNGDownload}>=</a> */}
        </div>

        {cust_chartview.gaugechart && (
          <div id="gauge_chart" className="bg-white">
            <text
              className="d-block"
              x={"50%"}
              y={5}
              textAnchor="middle"
              dominantBaseline="hanging"
              style={cust_chartview.gauge1.style}
            >{kpiname}
            </text>
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <GaugeComponent
                // ref={gaugeRef}
                // className="m-5"
                value={actualScore}
                minValue={min}
                maxValue={max}
                type="semicircle"
                labels={{
                  valueLabel: {
                    style: { fontSize: "20px", fill: actualIndicator, textShadow: "white" },
                  },
                  markLabel: {
                    type: "inner",
                    marks: [
                      { value: target }
                    ],

                    markerConfig: {
                      style: { fontSize: "20px", fill: "red", textShadow: "white" }
                    },
                    valueConfig: {
                      style: { fontSize: "12px", fill: "#0080FF", textShadow: "white" }
                    },

                  }
                }}


                arc={{
                  colorArray: indicatorcolors,
                  subArcs: indicatorcodes,
                  // subArcs:[
                  //   {
                  //     limit: 20,
                  //     color: '#EA4228',
                  //     showTick: true,
                  //     tooltip: { text: 'Empty' }
                  //   },
                  //   {
                  //     limit: 40,
                  //     color: '#F58B19',
                  //     showTick: true,
                  //     tooltip: { text: 'Low' }
                  //   },
                  //   {
                  //     limit: 60,
                  //     color: '#F5CD19',
                  //     showTick: true,
                  //     tooltip: { text: 'Fine' }
                  //   },
                  //   {
                  //     limit: 100,
                  //     color: '#5BE12C',
                  //     showTick: true,
                  //     tooltip: { text: 'Full' }
                  //   },
                  // ],
                  textShadow:'none',
                  padding: 0.005,
                  width: 0.15,
                  cornerRadius: 7,
                  gradient: false,
                  
                }}
                pointer={cust_chartview.gaugechart.pointer}
                marginInPercent={{ top: 0.08, bottom: 0.00, left: 0.07, right: 0.07 }}
                
                


                
              // pointer={{
              //   elastic: true,
              //   type: "needle",
              //   animationDelay: 100,
              //   animationDuration: 3000,
              //   width: 10,
              //   animate: true,
              //   length: 0.70,
              //   color: "gray",
              // }}               

              />
              </ResponsiveContainer>
          </div>
        )}


      </div>
    </>
  )
}

export default FnGaugeChartComponent;
