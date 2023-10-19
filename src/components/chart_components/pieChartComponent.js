/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Nov-2022   Arun R      Initial Version             V1

   ** This Page is to define Reusable pie chart component   **

============================================================================================================================================================*/

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import { ResponsiveContainer, PieChart, Pie } from "recharts";
import { useCurrentPng } from "recharts-to-png";
import FnDownloadChartComponent from "../downloadChartComponent";

const FnPieChartComponent = ({ kpi, min, max, id, kpiname, period, target, measure, updatedattributes, exportRestrict }) => {

  const [getPiePng, { ref: pieRef }] = useCurrentPng();
  let { authTokens, user } = useContext(AuthContext);
  const [chartview, setChartview] = useState([]);
  const [chartview_user, setChartview_user] = useState([]);
  const [inputs, setInputs] = useState({});

  let fnGetChartAttributes = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes/${"pie"}`,
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
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes/${user.user_id
      }/${"pie"}`,
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
  useEffect(() => {
    if (updatedattributes)
      setChartview(updatedattributes);
    else
      fnGetChartAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Custamized Lable

  const FnCustomizedLabel = (props) => {
    const { x, y, value } = props;
    if (num_place_val.length === 0) {

      if (value >= 1 && inputs['chart_axis']?.['value'] === 'Thousands') {
        return (
          <text
            x={x}
            y={y}
            dy={-3}
            fill="rgb(31, 119, 180)"
            fontSize={10}
            textAnchor="middle"
          >
            {value / 1000}k
          </text>
        );

      }
      else if (value >= 1 && inputs['chart_axis']?.['value'] === 'Millions') {
        return (
          <text
            x={x}
            y={y}
            dy={-3}
            fill="rgb(31, 119, 180)"
            fontSize={10}
            textAnchor="middle"
          >
            {value / 1000000}m
          </text>
        );
      }

      else if (value >= 1 && inputs['chart_axis']?.['value'] === 'Billions') {
        return (
          <text
            x={x}
            y={y}
            dy={-3}
            fill="rgb(31, 119, 180)"
            fontSize={10}
            textAnchor="middle"
          >
            {value / 1000000000}b
          </text>
        );
      }
    }

    else {
      if (measure === "Number") {
        if (value >= 1 && num_place_val[0] === 'Thousands') {
          return (
            <text
              x={x}
              y={y}
              dy={-3}
              fill="rgb(31, 119, 180)"
              fontSize={10}
              textAnchor="middle"
            >
              {value / 1000}k
            </text>
          );
        }
        else if (value >= 1 && num_place_val[0] === 'Millions') {
          return (
            <text
              x={x}
              y={y}
              dy={-3}
              fill="rgb(31, 119, 180)"
              fontSize={10}
              textAnchor="middle"
            >
              {value / 1000000}m
            </text>
          );
        }

        else if (value >= 1 && num_place_val[0] === 'Billions') {
          return (
            <text
              x={x}
              y={y}
              dy={-3}
              fill="rgb(31, 119, 180)"
              fontSize={10}
              textAnchor="middle"
            >
              {value / 1000000000}b
            </text>
          );
        }
      }
    }
    return (
      <text
        x={x}
        y={y}
        dy={-3}
        fill="rgb(31, 119, 180)"
        fontSize={10}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  };

  //  lable end

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
    cust_chartview.pie1 && cust_chartview.pie1.innerradius,
    cust_chartview.pie1 && cust_chartview.pie1.outerradius,
    cust_chartview.text && cust_chartview.text.x,
    cust_chartview.text && cust_chartview.text.y,
  ];

  for (let i = 0; i < intger_val.length; i++) {
    let obj = intger_val[i];
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
        obj[prop] = +obj[prop];
      }
    }
  }

  //! test

  const num_place_val = chartview.filter(plsval => plsval.attr_name.includes('numplace_value')).map(t => t.attr_value);

  const fnFormatValue = (value) => {

    if (num_place_val.length === 0) {

      if (value >= 1 && inputs['chart_axis']?.['value'] === 'Thousands') {

        return `${value / 1000}k`;

      }

      else if (value >= 1 && inputs['chart_axis']?.['value'] === 'Millions') {

        return `${value / 1000000}m`;

      }

      else if (value >= 1 && inputs['chart_axis']?.['value'] === 'Billions') {

        return `${value / 1000000000}b`;

      }

      return value;

    } else {
      if (measure === "Number") {
        if (value >= 1 && num_place_val[0] === 'Thousands') {

          return `${value / 1000}k`;

        }

        else if (value >= 1 && num_place_val[0] === 'Millions') {

          return `${value / 1000000}m`;

        }

        else if (value >= 1 && num_place_val[0] === 'Billions') {

          return `${value / 1000000000}b`;

        }
      }
      return value;

    }
  };


  //! test end

  return (
    <>
      <div className="bg-white sc_cl_chart_container rounded p-2">
        <div className="sc_cl_chart_export_icon">
          {exportRestrict ? <span>
            <FnDownloadChartComponent
              getchartPng={getPiePng}
              kpi={kpi}
              chart_name={kpiname}
              id={id}
            />
          </span> : ''}
        </div>
        {/* {console.log("cust_chartview.pie1.style", cust_chartview.pie1.style)} */}

        {cust_chartview.pie1 && (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart ref={pieRef}>
              <text
                x={'50%'}
                y={5}
                textAnchor="middle"
                dominantBaseline="hanging"
                style={cust_chartview.pie1.style}
              >
                {kpiname}
              </text>


              <Pie
                data={kpi}
                dataKey="actuals"
                nameKey="actuals"
                cx={cust_chartview.pie1.cx.value}
                cy={cust_chartview.pie1.cy.value}
                innerRadius={cust_chartview.pie1.innerradius.value}
                outerRadius={cust_chartview.pie1.outerradius.value}
                fill={cust_chartview.pie1.fill.color}
                tickFormatter={fnFormatValue}
                label={<FnCustomizedLabel />}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};
export default FnPieChartComponent;
