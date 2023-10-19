/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   16-Mar-2023   Priya S      Initial Version             V1

   ** This Page is to define Chart Preview   **

============================================================================================================================================================*/

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  createRef,
} from "react";
import AuthContext from "../../context/AuthContext";
import FnLineChartComponent from "../../components/chart_components/lineChartComponent";
import FnBarChartComponent from "../../components/chart_components/barChartComponent";
import FnAreaChartComponent from "../../components/chart_components/areaChartComponent";
import FnScatterChartComponent from "../../components/chart_components/scatterChartComponent";
import FnPieChartComponent from "../../components/chart_components/pieChartComponent";
import FnGaugeChartComponent from "../../components/chart_components/gaugeChartComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import { useNavigate, useParams } from "react-router-dom";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { BsBarChartFill, BsCheckLg, BsFillPieChartFill } from "react-icons/bs";
import { AiOutlineAreaChart, AiOutlineLineChart } from "react-icons/ai";
import { TbGauge } from "react-icons/tb";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdMenuOpen,
} from "react-icons/md";
import { PiChartScatterBold } from 'react-icons/pi'
import Swal from "sweetalert2";
import { Offcanvas, Modal } from "react-bootstrap";
import { BiMessageRoundedError } from "react-icons/bi";
import FnBtnComponent from "../../components/buttonComponent";

const FnChartAttributesSettings = () => {
  let { authTokens, user } = useContext(AuthContext);

  // states used to get, set and filter
  const [getChartToFilter, setChartToFilter] = useState([]);
  const [getFilteredChart, setFilteredChart] = useState([]);
  const [getSelectedChart, setSelectedChart] = useState();
  const [getGroupedAttributes, setGroupedAttributes] = useState([]);
  const [getAttributeOptions, setAttributeOptions] = useState([]);

  const [getMarginAttributeError, setMarginAttributeError] = useState({});
  const [getOtherAttributeError, setOtherAttributeError] = useState({});

  const [show, setShow] = useState(false);
  const [getUpdatButton, setUpdateButton] = useState(false);

  const [view, setView] = useState();
  const { id } = useParams();
  const navigator = useNavigate();

  const iconForCharts = [
    { id: 1, chart_type: "Bar", icon: <BsBarChartFill /> },
    { id: 2, chart_type: "Pie", icon: <BsFillPieChartFill /> },
    { id: 3, chart_type: "Area", icon: <AiOutlineAreaChart /> },
    { id: 4, chart_type: "Line", icon: <AiOutlineLineChart /> },
    { id: 5, chart_type: "Gauge", icon: <TbGauge /> },
    // { id: 6, chart_type: "Scatter", icon: <PiChartScatterBold /> }
  ];

  let tempdata = [
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "line",
      period: "2022-01-01",
      actuals: 60000,
      period_month: "Jan",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "line",
      period: "2022-02-01",
      actuals: 45000,
      period_month: "Feb",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "line",
      period: "2022-03-01",
      actuals: 38000,
      period_month: "Mar",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-04-01",
      actuals: 66000,
      period_month: "Apr",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-05-01",
      actuals: 80000,
      period_month: "May",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-06-01",
      actuals: 82000,
      period_month: "Jun",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-07-01",
      actuals: 81000,
      period_month: "Jul",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-08-01",
      actuals: 73000,
      period_month: "Aug",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-09-01",
      actuals: 75000,
      period_month: "Sep",
      period_year: "2022",
    },
    {
      id: 1,
      kpi: "KPI Title",
      baseline: 50000,
      target: 80000,
      min: 0,
      max: 100000,
      chart_type: "Line",
      period: "2022-10-01",
      actuals: 80000,
      period_month: "Oct",
      period_year: "2022",
    },
  ];

  let gaugedata = [
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-01-01",
      actuals: 65,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-02-01",
      actuals: 63,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-03-01",
      actuals: 70,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-04-01",
      actuals: 75,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-05-01",
      actuals: 87,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-06-01",
      actuals: 82,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-07-02",
      actuals: 84,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-08-01",
      actuals: 97,
    },
    {
      id: 10,
      kpi: "Reliable IT architecture",
      baseline: 75,
      target: 95,
      min: 0,
      max: 100,
      chart_type: "Gauge",
      period: "2023-09-01",
      actuals: 92,
    },
  ];

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Customize Chart Settings",
    },
  ];

  const fnGetPermissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      if (data.length > 0) {
        let pdata = { ...data };
        // setRemove(pdata[0].delete === "Y" ? true : false);
        // setEdit(pdata[0].edit === "Y" ? true : false);
        // setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
    fnGetChartAttributes();
    fnGetChartOptions();
  }, []);

  // GET API for Chart Attributes

  const fnGetChartAttributes = async () => {
    let chartAttributesRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes_settings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let chartAttributeResponse = await chartAttributesRequest.json();

    if (chartAttributesRequest.status === 200) {
      setChartToFilter(chartAttributeResponse);
    }
  };

  // DropDown Option Selection
  const fnGetChartOptions = async (chart_name) => {
    let res_opt = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_chart_attributes_options`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let opt_data = await res_opt.json();

    if (res_opt.status === 200 && opt_data.length > 0) {
      fndropdown(opt_data)
    }

  };


  const fndropdown = (opt_data) => {
    const optionsState = {
      position: [],
      fontFamily: [],
      placeval: [],
      align_value: [],
      legend_value: [],
      grid_value: [],
    };

    opt_data.forEach((opt) => {
      if (String(opt.attr_key) === String("position")) {
        optionsState.position = opt.attr_options.split(",");
      }
      if (String(opt.attr_key) === String("fontFamily")) {
        optionsState.fontFamily = opt.attr_options.split(",");
      }
      if (String(opt.attr_key) === String("placeval")) {
        optionsState.placeval = opt.attr_options.split(",");
      }
      if (String(opt.attr_key) === String("align_value")) {
        optionsState.align_value = opt.attr_options.split(",");
      }
      if (String(opt.attr_key) === String("grid_value")) {
        optionsState.grid_value = opt.attr_options.split(",");
      }
    });
    setAttributeOptions(optionsState);
  }



  // Filter Chart on Selected Icon
  const fnFilterChart = (selectedChart) => {
    const filteredChart = getChartToFilter.filter(
      (chart) => chart.chart_type === selectedChart
    );
    setFilteredChart(filteredChart);
    setUpdateButton(true);

    const components = [
      ...new Set(filteredChart.map((chart) => chart.component)),
    ];

    fnHandleDataSegregationOfCharts(filteredChart, selectedChart, components);
  };

  // Grouping the Chart Attributes
  const fnHandleDataSegregationOfCharts = (
    chartSegregation,
    selectedChart,
    components
  ) => {
    const transformedData = chartSegregation.reduce((acc, curr) => {

      if (curr.chart_type === 'Pie' && curr.component === 'pie1') {
        let existingChart = acc.find((item) => item.chart_type === selectedChart && item.component === 'pie1');

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            Pie: [],
          };
          acc.push(existingChart);
        }

        existingChart.Pie.push({
          id: curr.id,
          user_id: curr.user_id,
          chart_type: curr.chart_type,
          component: curr.component,
          attr_name: curr.attr_name,
          attr_key: curr.attr_key,
          attr_value: curr.attr_value,
          user_attr_name: curr.user_attr_name,
          default_attr_value: curr.default_attr_value,
          min: curr.min,
          max: curr.max,
          created_by: curr.created_by,
          last_updated_by: curr.last_updated_by,
        });
      }

      if (curr.chart_type === 'Gauge' && curr.component === 'gaugechart') {
        let existingChart = acc.find((item) => item.chart_type === selectedChart && item.component === 'gaugechart');

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            Chart: [],
            Text: []

          };
          acc.push(existingChart);
        }

        existingChart.Chart.push({
          id: curr.id,
          user_id: curr.user_id,
          chart_type: curr.chart_type,
          component: curr.component,
          attr_name: curr.attr_name,
          attr_key: curr.attr_key,
          attr_value: curr.attr_value,
          user_attr_name: curr.user_attr_name,
          default_attr_value: curr.default_attr_value,
          min: curr.min,
          max: curr.max,
          created_by: curr.created_by,
          last_updated_by: curr.last_updated_by,
        });
      }

      if (curr.chart_type === 'Gauge' && curr.component === 'gauge1') {
        let existingChart = acc.find((item) => item.chart_type === selectedChart && item.component === 'gauge1');

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            Chart: [],
            Text: []

          };
          acc.push(existingChart);
        }

        existingChart.Chart.push({
          id: curr.id,
          user_id: curr.user_id,
          chart_type: curr.chart_type,
          component: curr.component,
          attr_name: curr.attr_name,
          attr_key: curr.attr_key,
          attr_value: curr.attr_value,
          user_attr_name: curr.user_attr_name,
          default_attr_value: curr.default_attr_value,
          min: curr.min,
          max: curr.max,
          created_by: curr.created_by,
          last_updated_by: curr.last_updated_by,
        });
      }

      if (
        curr.chart_type === selectedChart &&
        curr.component === components[0]
      ) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            Margin: [],
          };
          acc.push(existingChart);
        }

        if (curr.attr_name === "margin") {
          existingChart.Margin.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }
      }

      if (curr.chart_type === selectedChart && curr.component === components[1]) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
          };
          acc.push(existingChart);
        }

        if (!existingChart.Xaxis1) {
          existingChart.Xaxis1 = {
            Label: [],
            Tick: [],
            Padding: [],
            Others: [],
          };
        }

        if (curr.attr_name === "label") {
          existingChart.Xaxis1.Label.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "tick") {
          existingChart.Xaxis1.Tick.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "padding") {
          existingChart.Xaxis1.Padding.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "dx" || curr.attr_name === "dy") {
          existingChart.Xaxis1.Others.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }
      }

      if (
        curr.chart_type === selectedChart &&
        curr.component === components[2]
      ) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
          };
          acc.push(existingChart);
        }

        if (!existingChart.Xaxis2) {
          existingChart.Xaxis2 = {
            Label: [],
            Tick: [],
            Others: [],
          };
        }

        if (curr.attr_name === "label") {
          existingChart.Xaxis2.Label.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "tick") {
          existingChart.Xaxis2.Tick.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "dx" || curr.attr_name === "dy") {
          existingChart.Xaxis2.Others.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }
      }

      if (
        curr.chart_type === selectedChart &&
        curr.component === components[3]
      ) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
          };
          acc.push(existingChart);
        }

        if (!existingChart.Yaxis1) {
          existingChart.Yaxis1 = {
            Label: [],
            Tick: [],
            Others: [],
          };
        }

        if (curr.attr_name === "label") {
          existingChart.Yaxis1.Label.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "tick") {
          existingChart.Yaxis1.Tick.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "dx" || curr.attr_name === "dy") {
          existingChart.Yaxis1.Others.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }
      }

      if (
        curr.chart_type === selectedChart &&
        curr.component === components[4]
      ) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
          };
          acc.push(existingChart);
        }

        if (!existingChart.Yaxis2) {
          existingChart.Yaxis2 = {
            Label: [],
            Tick: [],
          };
        }

        if (curr.attr_name === "label") {
          existingChart.Yaxis2.Label.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.attr_name === "tick") {
          existingChart.Yaxis2.Tick.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

      }

      if (
        curr.chart_type === selectedChart &&
        curr.component === components[5]
      ) {
        let existingChart = acc.find(
          (item) =>
            item.chart_type === selectedChart &&
            item.component === components[0]
        );

        if (!existingChart) {
          existingChart = {
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
          };
          acc.push(existingChart);
        }

        if (!existingChart.Stroke && curr.chart_type === "Line") {
          existingChart.Stroke = {
            AxisLine: [],
          };
        }

        if (!existingChart.Bar && curr.chart_type === "Bar") {
          existingChart.Bar = {
            AxisBar: [],
          };
        }

        if (!existingChart.Area && curr.chart_type === "Area") {
          existingChart.Area = {
            AxisArea: [],
          };
        }

        if (curr.component === "line1") {
          existingChart.Stroke.AxisLine.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.component === "bar1") {
          existingChart.Bar.AxisBar.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }

        if (curr.component === "area1") {
          existingChart.Area.AxisArea.push({
            id: curr.id,
            user_id: curr.user_id,
            chart_type: curr.chart_type,
            component: curr.component,
            attr_name: curr.attr_name,
            attr_key: curr.attr_key,
            attr_value: curr.attr_value,
            user_attr_name: curr.user_attr_name,
            default_attr_value: curr.default_attr_value,
            min: curr.min,
            max: curr.max,
            created_by: curr.created_by,
            last_updated_by: curr.last_updated_by,
          });
        }
      }
      return acc;
    }, []);
    setGroupedAttributes(transformedData);
  };

  // Chart selection handlers
  const handleChartIconSelection = (chartType) => {
    setSelectedChart(chartType);
    fnFilterChart(chartType);
  };

  // Input Handlers

  const handleAttrValueChange = (
    e,
    idx,
    settingAttributes,
    marginTitle,
    title
  ) => {
    const updateAttributes = [...getGroupedAttributes];

    if (marginTitle == "Margin" || marginTitle == "Pie" || marginTitle =='Chart') {
      updateAttributes[0][marginTitle][idx].attr_value = e.target.value;
      setGroupedAttributes(updateAttributes);
      if (
        e.target.value <= Number(updateAttributes[0][marginTitle][idx].max) &&
        Number(updateAttributes[0][marginTitle][idx].min) <= e.target.value
      ) {
        setMarginAttributeError({ ...getMarginAttributeError, [idx]: "" });
      } else {
        setMarginAttributeError({
          ...getMarginAttributeError,
          [idx]:
            "Limit Values Between " +
            updateAttributes[0][marginTitle][idx].min +
            " to " +
            updateAttributes[0][marginTitle][idx].max,
        });
      }
    } else {
      updateAttributes[0][marginTitle][title][idx].attr_value = e.target.value;
      setGroupedAttributes(updateAttributes);

      if (
        e.target.value <=
        Number(updateAttributes[0][marginTitle][title][idx].max) &&
        Number(updateAttributes[0][marginTitle][title][idx].min) <=
        e.target.value
      ) {
        setOtherAttributeError({ ...getOtherAttributeError, [idx]: "" });
      } else {
        setOtherAttributeError({
          ...getOtherAttributeError,
          [idx]:
            "Limit Values Between " +
            updateAttributes[0][marginTitle][title][idx].min +
            " to " +
            updateAttributes[0][marginTitle][title][idx].max,
        });
      }
    }
  };

  // Update Chart Attributes

  const fnUpdateData = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_chart_attributes_settings/${user.user_id}/`,
      {
        method: "PUT",
        body: JSON.stringify(getGroupedAttributes),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        text: "Values Updated Successfully!",
      });
    }
  };

  // Data Flatten in GroupedAttributes for the chart components

  const flatUpdatedAttribute = flattenAttributes(getGroupedAttributes);

  function flattenAttributes(data) {
    return data.reduce((flattenedData, obj) => {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          flattenedData.push(...obj[key]);
        } else if (typeof obj[key] === "object") {
          flattenedData.push(...flattenAttributes([obj[key]]));
        }
      }
      return flattenedData;
    }, []);
  }

  // off canvas operation
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  // Reset to default
  function fnResettoDef() {
    const tempvar = [...getGroupedAttributes]
    Object.entries(tempvar[0]).map(([key, value]) => {
      if (key === 'Margin') {
        value.map((itm) => {
          itm.attr_value = itm.default_attr_value
        })
      } else {
        Object.entries(value).map(([v_key, v_value]) => {
          if (key !== 'chart_type' && key !== 'component' && key !== 'user_id') {
            v_value.map((itm) => {
              itm.attr_value = itm.default_attr_value
            })
          }
        })
      }
    })
    setGroupedAttributes(tempvar)

  }

  return (
    <>
      {view === undefined ?
        ''
        : <>
          {view === false ? (
            // <FnAccessRestricted />
            <Modal
              show={true}
              centered
              style={{ padding: "20px", textAlign: "center" }}
            >
              <Modal.Header className="justify-content-center text-danger">
                <BiMessageRoundedError size={70} />
              </Modal.Header>
              <Modal.Body>
                <h2>{"User Restricted"}</h2>
                <h5> {"You don't have access!"}</h5>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <FnBtnComponent
                  onClick={() => navigator("/")}
                  children={"Close"}
                  classname={"sc_cl_close_button"}
                ></FnBtnComponent>
              </Modal.Footer>
            </Modal>
          ) : (
            <div className="sc_cl_div w-100 px-2">
              <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                  <h5 className="sc_cl_head m-0">Customize Chart Settings</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                  <FnBreadCrumbComponent
                    seperator_symbol={" >"}
                    nav_items={breadcumb_menu}
                  />
                </div>
              </div>

              {/* <hr></hr> */}

              <div className="d-flex flex-column flex-lg-row justify-content-around px-2 py-2 mt-lg-2">
                {/* Chart Icon */}
                <div className="d-flex flex-lg-row sc_cl_chart_icon_contatiner col-lg-1 col-12">
                  <div className="col-12 d-flex flex-row flex-lg-column">
                    {iconForCharts.map((item, index) => {
                      return (
                        <div
                          className="align-items-center d-flex  mt-2 justify-content-center sc_cl_icon_holder"
                          key={index}
                        >
                          <div className="align-items-center d-flex justify-content-center sc_cl_icon_card">
                            <i
                              onClick={() => handleChartIconSelection(item.chart_type)}
                              className={`${getSelectedChart === item.chart_type
                                ? "text-primary"
                                : ""
                                }`}
                            >
                              {item.icon}
                            </i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* canvas */}
                <div className="align-items-center col-lg-8 col-12 justify-content-center px-lg-5 py-lg-5 p-0 sc_cl_card_shadow sc_cl_canvas_container">
                  <>
                    {(() => {
                      switch (getSelectedChart) {
                        case "Bar":
                          return (
                            <FnBarChartComponent
                              kpi={tempdata}
                              min={0}
                              max={10000}
                              id={1}
                              target={50000}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        case "Line":
                          return (
                            <FnLineChartComponent
                              kpi={tempdata}
                              min={0}
                              max={100000}
                              id={1}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        case "Area":
                          return (
                            <FnAreaChartComponent
                              kpi={tempdata}
                              min={0}
                              max={10000}
                              id={1}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        case "Scatter":
                          return (
                            <FnScatterChartComponent
                              kpi={tempdata}
                              min={0}
                              max={10000}
                              id={1}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        case "Pie":
                          return (
                            <FnPieChartComponent
                              kpi={tempdata}
                              min={0}
                              max={10000}
                              id={1}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              period={2023}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        case "Gauge":
                          return (
                            <FnGaugeChartComponent
                              kpi={gaugedata}
                              min={0}
                              max={100}
                              target={80}
                              id={1}
                              measure={'Number'}
                              kpiname={"KPI Title"}
                              period={2023}
                              updatedattributes={flatUpdatedAttribute}
                            />
                          );
                        default:
                          return (
                            <div className="sc_cl_canvas_image">
                              <div className="text-center sc_cl_canvas_text">
                                <h4>Build Chart with your Choice</h4>
                                <p>Select Chart Type, and Customize as you want!</p>
                              </div>
                              <div className="sc_cl_canvas_image_contianer"></div>
                            </div>
                          );
                      }
                    })()}
                  </>
                </div>

                <div
                  className="d-lg-none d-flex align-items-center justify-content-center sc_cl_offcanvas_icon-holder "
                  onClick={toggleShow}
                >
                  <div>
                    <p className="m-0">
                      <MdMenuOpen />
                    </p>
                  </div>
                </div>

                {/* Arrtibutes Section */}
                <div className="col-3 px-3 py-3 rounded sc_cl_attribute_container d-lg-block d-none">
                  <div className="sc_cl_attribute_section">
                    {getGroupedAttributes.map((groupedItems, idx) => {
                      let AttributeTitle = Object.keys(groupedItems);
                      return (
                        <>
                          {
                            groupedItems.Pie ?
                              <FnMarginAttributes
                                marginTitle={AttributeTitle[3]}
                                marginAttributes={groupedItems.Pie}
                                eventHandler={handleAttrValueChange}
                                errorCode={getMarginAttributeError}
                              /> : null
                          }

                          {
                            groupedItems.Chart ?
                              <FnMarginAttributes
                                marginTitle={AttributeTitle[3]}
                                marginAttributes={groupedItems.Chart}
                                eventHandler={handleAttrValueChange}
                                errorCode={getMarginAttributeError}
                              /> : null
                          }

                          {groupedItems.Margin && groupedItems.Margin ? (
                            <FnMarginAttributes
                              marginTitle={AttributeTitle[3]}
                              marginAttributes={groupedItems.Margin}
                              eventHandler={handleAttrValueChange}
                              errorCode={getMarginAttributeError}
                            />
                          ) : null}

                          {groupedItems.Xaxis1 && groupedItems.Xaxis1 ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[4]}
                              otherAttributes={groupedItems.Xaxis1}
                              eventHandler={handleAttrValueChange}
                              attributeOptions={getAttributeOptions}
                              errorCode={getOtherAttributeError}
                            />
                          ) : null}

                          {groupedItems.Xaxis2 && groupedItems.Xaxis2 ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[5]}
                              otherAttributes={groupedItems.Xaxis2}
                              eventHandler={handleAttrValueChange}
                              attributeOptions={getAttributeOptions}
                              errorCode={getOtherAttributeError}
                            />
                          ) : null}
                          {groupedItems.Yaxis1 && groupedItems.Yaxis1 ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[6]}
                              otherAttributes={groupedItems.Yaxis1}
                              eventHandler={handleAttrValueChange}
                              attributeOptions={getAttributeOptions}
                              errorCode={getOtherAttributeError}
                            />
                          ) : null}
                          {groupedItems.Yaxis2 && groupedItems.Yaxis2 ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[7]}
                              otherAttributes={groupedItems.Yaxis2}
                              eventHandler={handleAttrValueChange}
                              attributeOptions={getAttributeOptions}
                              errorCode={getOtherAttributeError}
                            />
                          ) : null}
                          {groupedItems.Bar && groupedItems.Bar ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[8]}
                              otherAttributes={groupedItems.Bar}
                              eventHandler={handleAttrValueChange}
                              attributeOptions={getAttributeOptions}
                              errorCode={getOtherAttributeError}
                            />
                          ) : null}

                          {groupedItems.Stroke && groupedItems.Stroke ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[8]}
                              otherAttributes={groupedItems.Stroke}
                              errorCode={getOtherAttributeError}
                              attributeOptions={getAttributeOptions}
                              eventHandler={handleAttrValueChange}
                            />
                          ) : null}
                          {groupedItems.Area && groupedItems.Area ? (
                            <FnOtherAttributes
                              Attributetitle={AttributeTitle[8]}
                              otherAttributes={groupedItems.Area}
                              errorCode={getOtherAttributeError}
                              attributeOptions={getAttributeOptions}
                              eventHandler={handleAttrValueChange}
                            />
                          ) : null}
                        </>
                      );
                    })}
                  </div>


                  {/* Button Section */}

                  <div
                    className={`${getUpdatButton ? "d-flex" : "d-none"
                      } justify-content-between mt-2`}
                  >
                    <button
                      // className="bg-transparent border-0 text-primary text-decoration-underline"
                      className="sc_cl_close_button"
                      onClick={fnResettoDef}
                    >
                      Reset to default
                    </button>
                    <button className="sc_cl_submit_button" onClick={fnUpdateData}>
                      Update
                    </button>
                  </div>
                </div>


                {/* Off Canvas Section */}
                {/* <Offcanvas
                  show={show}
                  onHide={handleClose}
                  className="w-75"
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <p>{getSelectedChart}</p>
                  </Offcanvas.Header>
                  <Offcanvas.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex flex-column gap-2 justify-content-between">
                      {getGroupedAttributes.map((groupedItems, idx) => {
                        let AttributeTitle = Object.keys(groupedItems);
                        console.log({groupedItems})
                        return (
                          <>
                            {groupedItems.Margin.length > 0 && groupedItems.Margin ? (
                              <FnMarginAttributes
                                marginTitle={AttributeTitle[3]}
                                marginAttributes={groupedItems.Margin}
                                eventHandler={handleAttrValueChange}
                                errorCode={getMarginAttributeError}
                              />
                            ) : null}

                            {groupedItems.Xaxis1 && groupedItems.Xaxis1 ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[4]}
                                otherAttributes={groupedItems.Xaxis1}
                                eventHandler={handleAttrValueChange}
                                attributeOptions={getAttributeOptions}
                                errorCode={getOtherAttributeError}
                              />
                            ) : null}

                            {groupedItems.Xaxis2 && groupedItems.Xaxis2 ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[5]}
                                otherAttributes={groupedItems.Xaxis2}
                                eventHandler={handleAttrValueChange}
                                attributeOptions={getAttributeOptions}
                                errorCode={getOtherAttributeError}
                              />
                            ) : null}
                            {groupedItems.Yaxis1 && groupedItems.Yaxis1 ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[6]}
                                otherAttributes={groupedItems.Yaxis1}
                                eventHandler={handleAttrValueChange}
                                attributeOptions={getAttributeOptions}
                                errorCode={getOtherAttributeError}
                              />
                            ) : null}
                            {groupedItems.Yaxis2 && groupedItems.Yaxis2 ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[7]}
                                otherAttributes={groupedItems.Yaxis2}
                                eventHandler={handleAttrValueChange}
                                attributeOptions={getAttributeOptions}
                                errorCode={getOtherAttributeError}
                              />
                            ) : null}
                            {groupedItems.Bar && groupedItems.Bar ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[8]}
                                otherAttributes={groupedItems.Bar}
                                eventHandler={handleAttrValueChange}
                                attributeOptions={getAttributeOptions}
                                errorCode={getOtherAttributeError}
                              />
                            ) : null}

                            {groupedItems.Stroke && groupedItems.Stroke ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[8]}
                                otherAttributes={groupedItems.Stroke}
                                errorCode={getOtherAttributeError}
                                attributeOptions={getAttributeOptions}
                                eventHandler={handleAttrValueChange}
                              />
                            ) : null}
                            {groupedItems.Area && groupedItems.Area ? (
                              <FnOtherAttributes
                                Attributetitle={AttributeTitle[8]}
                                otherAttributes={groupedItems.Area}
                                errorCode={getOtherAttributeError}
                                attributeOptions={getAttributeOptions}
                                eventHandler={handleAttrValueChange}
                              />
                            ) : null}
                            
                          </>
                        );
                      })}
                    </div>

                    <div
                      className={`${getUpdatButton ? "d-flex" : "d-none"
                        } justify-content-between`}
                    >
                      <button
                        className="bg-transparent border-0 text-muted text-primary"
                        onClick={fnResettoDef}
                      >
                        Reset to default
                      </button>
                      <button className="sc_cl_submit_button" onClick={fnUpdateData}>
                        Update
                      </button>
                    </div>
                  </Offcanvas.Body>
                </Offcanvas> */}
              </div>
            </div>
          )}
        </>
      }
    </>
  );
};

const FnMarginAttributes = ({
  marginTitle,
  marginAttributes,
  eventHandler,
  errorCode,
}) => {
  const expandRef = useRef(null);

  const toggleExpand = () => {
    if (!expandRef.current) {
      expandRef.current.classList.toggle("sc_cl_hide");
    } else {
      expandRef.current.classList.toggle("sc_cl_hide");
    }
  };

  return (
    <div className="sc_cl_attribute_contanier">
      {/* <div onClick={toggleExpand} className="sc_cl_dropdown-header"> */}
      <div onClick={toggleExpand} className="sc_cl_dropdown-header">
        <span>
          <p className="m-0">{marginTitle}</p>
          <i>
            {expandRef.current?.classList.contains("sc_cl_show") ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </i>
        </span>
      </div>
      <div className={`sc_cl_dropdown_expand `}>
        <ul>
          {marginAttributes &&
            marginAttributes.map((attributeItems, idx) => {
              return (
                <li
                  key={attributeItems.att_id}
                  className="d-flex flex-column my-2"
                >
                  <span>
                    {attributeItems.attr_key.charAt(0).toUpperCase() +
                      attributeItems.attr_key.slice(1)}
                  </span>

                  <span>
                    <input
                      className="form-control-sm"
                      value={attributeItems.attr_value || ""}
                      onChange={(e) =>
                        eventHandler(e, idx, marginAttributes, marginTitle)
                      }
                    />
                    <p className="text-danger m-0">{errorCode[idx]}</p>
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

const FnOtherAttributes = ({ otherAttributes, Attributetitle, eventHandler, attributeOptions, errorCode, }) => {
  const [mainHeaderOpen, setMainHeaderOpen] = useState(false);
  const [subHeaderOpen, setSubHeaderOpen] = useState({});

  // const sampleColors = [
  //   "#0040ff95",
  //   "#00ff0095",
  //   "#ffbf0095",
  //   "#ff00ff95",
  //   "#ff008095",
  // ];

  let xaxisKeys = otherAttributes ? Object.keys(otherAttributes) : [];

  const toggleMainHeader = () => {
    setMainHeaderOpen((prevState) => !prevState);
  };

  const toggleSubHeader = (key) => {
    setSubHeaderOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const FnSelectComp = ({ keyToCompare, onchange, selectedOption }) => {
    let dropdownKeys = attributeOptions[keyToCompare];
    return (
      <>
        <select onChange={onchange} value={selectedOption}>
          {dropdownKeys.length > 0 && dropdownKeys.map((items, idx) => (
            <option key={idx}>{items}</option>
          ))}
        </select>
      </>
    );
  };

  const openColorPicker = (idx) => {
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.click();
  };

  return (
    <div className="sc_cl_attribute_contanier">
      <div className="sc_cl_dropdown-header" onClick={toggleMainHeader}>
        <span>
          <p className="m-0">{Attributetitle}</p>
          <i>
            {mainHeaderOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </i>
        </span>
      </div>
      {xaxisKeys.length > 0 &&
        xaxisKeys.map((axiskeys, idx) => (
          <div
            key={idx}
            className={`sc_cl_dropdown_sub_expand_body ${mainHeaderOpen ? "sc_cl_show" : "sc_cl_hide"
              }`}
          >
            <div className="sc_cl_attribute_contanier">
              <div
                className="sc_cl_dropdown-header mt-2"
                onClick={() => toggleSubHeader(axiskeys)}
              >
                <span>
                  <p className="m-0">{axiskeys}</p>
                  <i>
                    {subHeaderOpen[axiskeys] ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                  </i>
                </span>
              </div>

              <div
                className={`sc_cl_dropdown_sub_expand ${subHeaderOpen[axiskeys] ? "sc_cl_show" : "sc_cl_hide"
                  }`}
              >
                <ul>
                  {otherAttributes[axiskeys].map((items, idx) => (
                    <li key={items.att_id} className="my-2 d-flex flex-column">

                      <span>
                        {items.user_attr_name}
                      </span>

                      <span>
                        {(() => {
                          switch (items.attr_key) {
                            case "fill":
                              return (
                                <div className="d-flex align-items-center">
                                  {/* {sampleColors.map((colorItems, idx) => {
                                    return (
                                      <>
                                        <button
                                          key={idx}
                                          style={{
                                            backgroundColor: colorItems,
                                          }}
                                          value={colorItems}
                                          onClick={() =>
                                            openColorPicker(colorItems)
                                          }
                                        ></button>
                                      </>
                                    );
                                  })} */}
                                  <label htmlFor="colorPicker">
                                    Pick a color:
                                  </label>
                                  <input
                                    type="color"
                                    id="colorPicker"
                                    role="button"
                                    value={items.attr_value}
                                    onChange={(e) =>
                                      eventHandler(
                                        e,
                                        idx,
                                        otherAttributes,
                                        Attributetitle,
                                        axiskeys
                                      )
                                    }
                                    style={{ height: "25px", width: "25px" }}
                                  />
                                </div>
                              );
                            case "position":
                              return (
                                <FnSelectComp
                                  keyToCompare={items.attr_key}
                                  selectedOption={items.attr_value}
                                  onchange={(e) =>
                                    eventHandler(
                                      e,
                                      idx,
                                      otherAttributes,
                                      Attributetitle,
                                      axiskeys
                                    )
                                  }
                                />
                              );
                            case "placeval":
                              return (
                                <FnSelectComp
                                  keyToCompare={items.attr_key}
                                  selectedOption={items.attr_value}
                                  onchange={(e) =>
                                    eventHandler(
                                      e,
                                      idx,
                                      otherAttributes,
                                      Attributetitle,
                                      axiskeys
                                    )
                                  }
                                />
                              );
                            case "align_value":
                              return (
                                <FnSelectComp
                                  keyToCompare={items.attr_key}
                                  selectedOption={items.attr_value}
                                  onchange={(e) =>
                                    eventHandler(
                                      e,
                                      idx,
                                      otherAttributes,
                                      Attributetitle,
                                      axiskeys
                                    )
                                  }
                                />
                              );
                            case "grid_value":
                              return (
                                <FnSelectComp
                                  keyToCompare={items.attr_key}
                                  selectedOption={items.attr_value}
                                  onchange={(e) =>
                                    eventHandler(
                                      e,
                                      idx,
                                      otherAttributes,
                                      Attributetitle,
                                      axiskeys
                                    )
                                  }
                                />
                              );
                            case "color":
                              return (
                                <div className="d-flex align-items-center">
                                  {/* {sampleColors.map((colorItems, idx) => {
                                    return (
                                      <>
                                        <button
                                          key={idx}
                                          style={{
                                            backgroundColor: colorItems,
                                          }}
                                          value={colorItems}
                                          onClick={() =>
                                            openColorPicker(colorItems)
                                          }
                                        ></button>
                                      </>
                                    );
                                  })} */}
                                  <label htmlFor="colorPicker">
                                    Pick a color:
                                  </label>
                                  <input
                                    type="color"
                                    id="colorPicker"
                                    role="button"
                                    value={items.attr_value}
                                    onChange={(e) =>
                                      eventHandler(
                                        e,
                                        idx,
                                        otherAttributes,
                                        Attributetitle,
                                        axiskeys
                                      )
                                    }
                                    style={{ height: "25px", width: "25px" }}
                                  />
                                </div>
                              );

                            default:
                              return (
                                <span>
                                  <input
                                    className="form-control-sm"
                                    value={items.attr_value || ""}
                                    onChange={(e) =>
                                      eventHandler(
                                        e,
                                        idx,
                                        otherAttributes,
                                        Attributetitle,
                                        axiskeys
                                      )
                                    }
                                  />
                                  <i>{errorCode[idx]}</i>
                                </span>
                              );
                          }
                        })()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FnChartAttributesSettings;
