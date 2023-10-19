import React, { useContext, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { Link } from "react-router-dom";
import moment from "moment";
import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";
import { MdClose } from "react-icons/md";
import { BiRadioCircle } from "react-icons/bi";

const FnActivityCalendar = ({ pending, highlightedDays, setFlag, flag, setactivity }) => {
  let { setKpiId, setNavigateAct } = useContext(AuthContext);
  const [value, setValue] = useState(new Date());
  let { userSettings } = useContext(PreContext);
  const [selectedDates, setSelectedDates] = useState(new Date());
  const [pendingList, setPendingList] = useState([]);
  const minDate = new Date(2023, 1, 1);
  const maxDate = new Date(2024, 1, 28);

  const formatTwoDigits = (number) => {
    return number.toString().padStart(2, "0");
  };

  const DateNow = new Date();
  const DateNowStr = `${DateNow.getFullYear()}-${formatTwoDigits(
    DateNow.getMonth() + 1
  )}-${formatTwoDigits(DateNow.getDate())}T${formatTwoDigits(
    DateNow.getHours()
  )}:${formatTwoDigits(DateNow.getMinutes())}:${formatTwoDigits(
    DateNow.getSeconds()
  )}`;

  const fnChange = (newValue) => {
    setValue(newValue);
  };

  const handleDateClick = (clickedDate) => {
    const isSelected = isSameDay(selectedDates, clickedDate);
    const list = pending.filter((item) =>
      isSameDay(new Date(item.upcoming_date), clickedDate)
    );

    if (isSelected) {
      setFlag(true);
      setPendingList(list);
      setSelectedDates(value);
    } else {
      setPendingList([]);
      setSelectedDates(clickedDate);
    }
  };

  const renderDayInPicker = (props) => {
    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.getDate()) >= 0;
    if (isSelected) {
      return (
        <div className={"dayWithDotContainer"}>
          {props.dayComponent}
          <div className={"dayWithDot"} />
        </div>
      );
    }

    return props.dayComponent;
  };

  const fnActulLink = (val) => {
    setNavigateAct(true);
    setKpiId(val);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatTime = (time) => {
    let d = moment(time, "yyyy-mm-ddThh:mm:ss", true);
    if (d.isValid()) {
      let temp = d.format(
        userSettings && userSettings.date
          ? userSettings.date.toUpperCase()
          : process.env.REACT_APP_DATE_FORMAT.toUpperCase()
      );
      return temp;
    } else {
      let temp = moment(time).format(
        userSettings && userSettings.date
          ? userSettings.date.toUpperCase()
          : process.env.REACT_APP_DATE_FORMAT.toUpperCase()
      );
      return temp;
    }
  };

  return (
    <>
      <div className={flag ? "d-none" : "current"}>
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <button
          className="sc_cl_Head_close"
          onClick={() => {
            setactivity(false);
          }}
        >
          <MdClose size={20} />
        </button>
          <StaticDatePicker
            variant="mobile"
            orientation="portrait"
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => fnChange(newValue)}
            slots={{
              day: (props) => {
                const isSelected =
                  highlightedDays &&
                  highlightedDays.some(
                    (date) =>
                      !props.outsideCurrentMonth && isSameDay(date, props.day)
                  );
                let count =
                  highlightedDays &&
                  highlightedDays.filter((date, index) => {
                    return (
                      !props.outsideCurrentMonth && isSameDay(date, props.day)
                    );
                  });

                return (
                  <Badge
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 9,
                        height: 15,
                        minWidth: 15,
                      },
                    }}
                    key={props.day.toString()}
                    overlap="circular"
                    color={"error"}
                    // variant="dot"
                    invisible={!isSelected}
                    badgeContent={count && count.length}
                    onClick={() => {
                      handleDateClick(props.day);
                    }}
                  >
                    <PickersDay {...props} />
                  </Badge>
                );
              },
            }}
          />
        </LocalizationProvider>
      </div>
      <div className={flag ? "sc_cl_activityList show" : "d-none"}>
        <div className="sc_cl_activity_head d-flex justify-content-between">
          Activity
          <button
            className="sc_cl_head_button"
            onClick={() => {
              setFlag(false);
            }}
          >
            <MdClose size={20} />
          </button>
        </div>
        {pendingList && pendingList.length === 0 && (
          <div className="sc_cl_activity_foot">
            <h4 className="menu-title">No Activity</h4>
          </div>
        )}
        <div className="sc_cl_activity_body">
          {
            <div className=" sc_cl_activity_content_dis">
              {pendingList &&
                pendingList.map((data, i) => {
                  if (i < 5) {
                    return (
                      <div
                        // className={`${
                        //   data.status === "Past"
                        //     ? "sc_cl_activity_dot_line"
                        //     : "sc_cl_activity_border_line"
                        // }`}
                        className="d-flex sc_cl_borderBottom"
                        key={i}
                      >
                        <BiRadioCircle className="Icon m-3" />

                        <div className="sc_cl_activity_content">
                          {DateNowStr >= data.upcoming_date ? (
                            <Link
                              to={{ pathname: `kpi_actuals/${data.kpi_id}` }}
                              className="sc_cl_activity-item"
                              onClick={() => {
                                fnActulLink(data.kpi_id);
                              }}
                            >
                              {data.kpi}
                            </Link>
                          ) : (
                            <p className="sc_cl_activity-item">{data.kpi}</p>
                          )}
                          <p className="sc_cl_activity-item-date-info">
                            {formatTime(data.upcoming_date)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          }
          <div id="tb-sc-expand-activity-container">
            <div className="sc_cl_activity_content_exp collapsed">
              {pendingList &&
                pendingList.map((data, i) => {
                  if (i >= 5) {
                    return (
                      <div className="sc_cl_activity_content" key={i}>
                        <div>
                          {DateNowStr >= data.upcoming_date ? (
                            <a className="sc_cl_activity-item">{data.kpi}</a>
                          ) : (
                            <p className="sc_cl_activity-item">{data.kpi}</p>
                          )}
                          <p className="sc_cl_activity-item-date-info">
                            {formatTime(data.upcoming_date)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
        <div
          className={
            pending && pending.length > 3 ? "sc_cl_activity_foot" : "d-none"
          }
        >
          {/* <h4 className="menu-title" onClick={(e) => handleClick(e)}>
            {showallnotification ? "Collapse All" : "View all"}
          </h4> */}
        </div>
      </div>
    </>
  );
};

export default FnActivityCalendar;
