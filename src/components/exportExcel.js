import {useRef} from 'react'
import { useDownloadExcel } from 'react-export-table-to-excel'
export default function FnExportExcel(props) {
    
    // const tableRef = props.ref;
  
    const { onDownload } = useDownloadExcel({
      currentTableRef: props.divref,
      filename: props.filename,
      sheet: "Users"
    });
  
    return (
        <button onClick={onDownload}> {props.btnname}</button>
    );
  }