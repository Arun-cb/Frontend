/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.

   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   30-Aug-2022   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define table component  **

============================================================================================================================================================*/

import { useState, useEffect, useContext } from "react";
import FnTableBody from "./tableBodyComponent";
import FnTableHead from "./tableHeadComponent";
import "bootstrap/dist/css/bootstrap.css";
import { Table } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import FnPagination from "./pagination";
import "../Assets/CSS/global.css";
import moment from "moment";
import PreContext from "../context/PreContext";
import { CSVLink } from "react-csv";
import {FaFileExport} from 'react-icons/fa'

const FnTableComponent = ({
  checkupd,
  data,
  csv_export,
  data_length,
  columns_type,
  bol_labels,
  page_size,
  start,
  columns_in,
  date_columns,
  close,
  updates,
  load,
  add,
  view,
  diverts,
  menu_id,
  api_name,
  action,
  kpi,
  searchWord,
  current,
  pagination,
  custom_action,
  sortcolumn,
  setSortColumn,
  sortorder,
  setSortOrder,
  sorting
}) => {
  let { authTokens, user } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [tableData, setTableData] = useState([]);

  const [remove, setRemove] = useState(false);
  const [edit, setEdit] = useState(false);
  const PageSize = page_size;

  const [currentPage, setCurrentPage] = useState(current ? current : 1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const currentTableData = data;
  
  const fnGetPermissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${menu_id}/`,
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
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        add(pdata[0].add === "Y" ? true : false);
      }
    }
  };

  const columns = columns_in;

  const fnDataSet = () => {
    for (let i = 0; i < currentTableData.length; i++) {
      date_columns && date_columns.forEach((item) => {
        const date = new Date(currentTableData[i][item]);
        currentTableData[i] = {
          ...currentTableData[i],
          [item]: moment(date).format(
            userSettings && userSettings.date
              ? userSettings.date.toUpperCase().replace("O", "o")
              : process.env.REACT_APP_DATE_FORMAT
          ),
        };
      });
    }
    setTableData(currentTableData);
  };
  
    useEffect(() => {
      fnDataSet();
      fnGetPermissions();
      start(firstPageIndex);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, currentPage]);

    return (
      <div className={`${custom_action == true ? 'col-9' : ''} sc_cl_div overflow-auto`}>
        <Table
          className="sc_cl_table m-auto table-responsive"
          hover
        >
          <FnTableHead {...{ columns, action, sortcolumn, setSortColumn, sortorder, setSortOrder, sorting }} />
          <FnTableBody
            {...{
              checkupd,
              columns,
              columns_type,
              bol_labels,
              tableData,
              close,
              updates,
              load,
              edit,
              view,
              diverts,
              remove,
              api_name,
              action,
              kpi,
              searchWord
            }}
          />
        </Table>

        {pagination ? (
          <div className="sc_cl_pagination_footer d-flex justify-content-end">
              <FnPagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data_length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
          </div>
        ) : ("")}
      </div>
    );
  
};

export default FnTableComponent;
