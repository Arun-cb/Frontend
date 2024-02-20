// ============================================================================================================================================================

//  CITTIABASE SOLUTIONS - All Rights Reserved.

//  ------------------------------------------------------------------------------------------------------------------------------------------------------------

//  21-MAR-2023 Revan Rufus S Initial Version V1

//  ** This Component file contains Functionality of Submit Button **
// ============================================================================================================================================================


import React from "react";

//this functions were click event being handled
export default function FnBtnComponent({ onClick, children,classname, Icon,disabled }) {
    return (
        <button
        onClick={onClick} //onClick function Props 
        className={classname} // css Classname Props
        disabled ={disabled}
        
        >
           {Icon}{children} {/* button label Props  */}
        </button>
    )
}
//ends here