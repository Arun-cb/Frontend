/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   28-JAN-2024  Jagadeshwaran R      Initial Version             V1

   ** YData Profiling page Open's a new Tab with Profiled Data **

==========================================================================================================================*/

import React from "react";

const FnYDataProfiling = ({ datasource }) => {

    return (
        <div className="ydataprofiling">
            <iframe
                title="YData Profiling Report"
                srcDoc={datasource}
                style={{ width: '100%', height: '900px', border: 'none' }}
            />
        </div>
    );
};

export default FnYDataProfiling;
