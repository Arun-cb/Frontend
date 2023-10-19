/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Nov-2022   Arun R      Initial Version             V1

   ** This Page is to define Reusable scatter chart component   **

============================================================================================================================================================*/

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  LabelList,
  ReferenceLine
} from "recharts";
import { useCurrentPng } from "recharts-to-png";
import FnDownloadChartComponent from "../downloadChartComponent";

const FnScatterChartComponent = ({ kpi, min, max, id, kpiname, measure, updatedattributes, exportRestrict, target, frequency }) => {
  const [getScatterPng, { ref: scatterRef }] = useCurrentPng();
  let { authTokens, user } = useContext(AuthContext);
  const [chartview, setChartview] = useState([]);
  const [chartview_user, setChartview_user] = useState([]);
  const [inputs, setInputs] = useState({});

  let fnGetChartAttributes = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL
      }/api/get_chart_attributes/${"scatter"}`,
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
      }/${"scatter"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let viewUserData = await res_user.json();

    if (res_user.status === 200) {
      if (viewUserData.length > 0) {
        setChartview_user(viewUserData);
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
    cust_chartview.scatterchart && cust_chartview.scatterchart.margin,
    cust_chartview.xaxis2 && cust_chartview.xaxis2.label,
    cust_chartview.yaxis1 && cust_chartview.yaxis1.label,
    cust_chartview.text && cust_chartview.text.x,
    cust_chartview.text && cust_chartview.text.y,
    cust_chartview.CartesianGrid && cust_chartview.CartesianGrid.strokeDasharray,
    cust_chartview.span && cust_chartview.span.style,
    cust_chartview.scatter1 && cust_chartview.scatter1.style,
  ];

  for (let i = 0; i < intger_val.length; i++) {
    let obj = intger_val[i];
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
        obj[prop] = +obj[prop];
      }
    }
  }

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

  //To get Year for x-axis 
  let count_year = Object.create(null);
  let end_of_mon_by_year = [];
  let tick_position = [];

  kpi.forEach((ele, i) => {
    count_year[ele.period_year] = { last: i };
  });

  Object.keys(count_year).map((year) =>
    end_of_mon_by_year.push(count_year[year].last, count_year[year].last + 1)
  );

  Object.keys(count_year).forEach((year, i) => {
    if (i === 0) {
      tick_position.push(Math.floor(count_year[year].last / 2));
    }
    else {
      let betw_year = (count_year[year].last - (count_year[year - 1].last + 1)) / 2;
      tick_position.push(Math.floor(count_year[year - 1].last + betw_year) + 1);
    }
  });

  const fnRenderQuarterTick = (tickProps) => {
    const { x, y, payload } = tickProps;
    const { value, offset, index } = payload;
    const date = new Date(value);
    const month = date.toLocaleString('default', { month: 'short' });
    // const month = date.getMonth();
    const year = date.getFullYear();
    // console.log(year)

    if (tick_position.includes(index)) {
      return (
        <text
          x={x}
          y={y - 4}
          textAnchor="middle"
          dy="10"
          fill="rgb(31, 119, 180)"
          fontSize={10}
        >
          {year}
        </text>
      );
    }
    const isLast = month === 11;
    if (index === 0 || end_of_mon_by_year.includes(index)) {
      const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.3;
      return (
        <>
          <path d={`M${x},${y - 4}v${-10}`} stroke="red" />
        </>
      );
    }
    return null;
  };

  //To get Month for x-axis
  let count_month = Object.create(null);
  let end_of_date_by_mon = [];
  let tick_position_mon = [];

  kpi.forEach((ele, i) => {
    count_month[ele.period_month] = { last: i };
  });

  Object.keys(count_month).map((month) =>
    end_of_date_by_mon.push(count_month[month].last, count_month[month].last + 1)
  );

  Object.keys(count_month).forEach((month, i) => {
    if (i === 0) {
      tick_position_mon.push(Math.floor(count_month[month].last / 2));
    } else {
      let betw_month = ((count_month[month].last) - (count_month[month].last + 15));
      tick_position_mon.push(Math.floor(count_month[month].last + betw_month));
    }
  });


  const fnRenderQuarterTickMon = (tickProps) => {
    const { x, y, payload } = tickProps;
    const { value, offset, index } = payload;
    const date = new Date(value);
    const month = date.toLocaleString('default', { month: 'short' });
    // const month = date.getMonth();
    const year = date.getFullYear();

    if (tick_position_mon.includes(index)) {
      return (
        <text
          x={x}
          y={y - 4}
          textAnchor="middle"
          dy="10"
          fill="rgb(31, 119, 180)"
          fontSize={10}
        >
          {month}
        </text>
      );
    }
    const isLast = date === 30;
    if (index === 0 || end_of_date_by_mon.includes(index)) {
      const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.3;
      return (
        <>
          <path d={`M${pathX},${y - 4}v${-10}`} stroke="red" />
        </>
      );
    }
    return null;
  };


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

  const [getLinePng, { ref: lineRef }] = useCurrentPng();

  // Check Frequency-Wise Charts
  let kpi_frequency = [...new Set(kpi.map(tem => tem.frequency))];

  let cust_grid = [...new Set(chartview.map(tem => tem.attr_value))];

  let grid_show = (String(cust_grid).includes(String("Yes")))

  let legendAlign = [...new Set(chartview.map(tem => tem.attr_value))];

  let legendShow = (String(legendAlign).includes(String("Show")))


  return (
    <>
      <div className="bg-white sc_cl_chart_container rounded p-2">
        <div className="sc_cl_chart_export_icon">
          {exportRestrict ?
            <FnDownloadChartComponent
              getchartPng={getScatterPng}
              kpi={kpi}
              chart_name={kpiname}
              id={id}
            />
            : ''}
        </div>


        {cust_chartview.xaxis1 && (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ScatterChart
              data={kpi}
              margin={cust_chartview.scatterchart.margin}
              ref={scatterRef}
            >

              <text
                x={"50%"}  
                y={5}
                textAnchor="middle"
                dominantBaseline="hanging"
                style={cust_chartview.scatter1.style}
              >
                {kpiname}
              </text>

              {
                (String(frequency) !== "Annualy") && (String(frequency) !== "Daily") &&
                <>
                  <XAxis
                    tickLine={true}
                    xAxisId={0}
                    label={cust_chartview.xaxis1.label}
                    interval={0}
                    dataKey="period_month"
                    name="Month"
                    tick={cust_chartview.xaxis1.tick}
                  />

                  <XAxis
                    xAxisId={1}
                    allowDuplicatedCategory={false}
                    label={cust_chartview.xaxis2.label}
                    interval={0}
                    dataKey="period"
                    tickLine={false}
                    axisLine={true}
                    tick={fnRenderQuarterTick}
                  />

                </>
              }

              {
                (String(frequency) === "Annualy") &&
                <>
                  <XAxis
                    xAxisId={1}
                    allowDuplicatedCategory={false}
                    label={cust_chartview.xaxis2.label}
                    interval={0}
                    dataKey="period"
                    tickLine={false}
                    axisLine={true}
                    tick={fnRenderQuarterTick}
                  />
                </>
              }


              {
                (String(frequency) === "Daily") &&
                <>
                  <XAxis
                    tickLine={true}
                    xAxisId={0}
                    label={cust_chartview.xaxis1.label}
                    interval={0}
                    dataKey="period_date"
                    tick={cust_chartview.xaxis1.tick}
                  />
                  <XAxis
                    xAxisId={1}
                    allowDuplicatedCategory={false}
                    label={cust_chartview.xaxis2.label}
                    interval={0}
                    dataKey="period"
                    tickLine={false}
                    axisLine={true}
                    tick={fnRenderQuarterTickMon}
                  />
                  <XAxis
                    xAxisId={2}
                    allowDuplicatedCategory={false}
                    label={cust_chartview.xaxis2.label}
                    interval={0}
                    dataKey="period"
                    tickLine={false}
                    axisLine={true}
                    tick={fnRenderQuarterTickMon}
                  />
                </>
              }
              <YAxis
                tick={cust_chartview.yaxis1.tick}
                dataKey="actuals"
                name="Actuals"
                label={cust_chartview.yaxis1.label}
                interval={0}
                tickFormatter={fnFormatValue}
              />
              {(() => {
                if (grid_show) {
                  return (
                    <CartesianGrid strokeDasharray="3 3" fill="#f0f4f5" />
                  )
                }
                else {
                  return (
                    <></>
                  )
                }
              })()}

              {(() => {
                if (legendShow) {
                  return (
                    <Legend wrapperStyle={{ fontSize: cust_chartview.xaxis2.label.fontSize }} iconType="circle" align="center" verticalAlign="bottom" layout="horizontal" />
                  )
                }
                else {
                  return (
                    <></>
                  )
                }
              })()}
              <Tooltip />
              <ReferenceLine
                y={target}
                stroke="#74125c"
                strokeDasharray="3 3"
                label={{
                  position: "insideBottomRight",
                  fontSize: "14"
                }}
              />
              <Scatter
                type="monotone"
                dataKey="target"
                name=" -- Target"
                fill="#74125c"
              />
              <Scatter
                name="Actuals"
                data={kpi}
                fill={cust_chartview.scatter1.fill.color}
                label={<FnCustomizedLabel />}
                tickFormatter={fnFormatValue}
              >
                <LabelList dataKey="actuals"
                  position="insideBottom"
                  angle={360}
                  offset={10}
                  fill="#e6194d"
                  fontSize={10} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

      </div>
    </>
  );
};
export default FnScatterChartComponent;
