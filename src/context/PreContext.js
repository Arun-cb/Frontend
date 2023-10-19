import { createContext, useState, useEffect, useContext, useRef } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.min.js';
import AuthContext from './AuthContext';
import CryptoJS from "crypto-js";
import Spinner from '../components/Spinner';

const PreContext = createContext()

export default PreContext;

export const PreProcessing = ({ children }) => {
    let { authTokens, user, logoutUser, current_date } = useContext(AuthContext)
    let [userSettings, setUserSettings] = useState(() => localStorage.getItem('userSettings') ? JSON.parse(localStorage.getItem('userSettings')) : null)
    let [preloading, setPreLoading] = useState(false)
    let [closealert, setclosealert] = useState(false)
    let [isloading, setIsLoading] = useState(null);
    let [encrpteddata, setEncrptedData] = useState();
    let [decryptdata, setDecrptedData] = useState();
    const [idletime, setIdleTime] = useState({})

    const nav_menus = [
        // {'menu_name': 'Organization', 'url': '/',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },
        // {'menu_name': 'Unit of measure', 'url': '/',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },
        // {'menu_name': 'Score Card', 'url': 'score_card_details',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },   
        // {'menu_name': 'KPI', 'url': '/',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },
        // {'menu_name': 'Definition', 'url': 'organization_definition_details',  'parent_menu_id': '1', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },
        // {'menu_name': 'Functional Level', 'url': 'organization_functional_level_details',  'parent_menu_id': '1', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },
        // {'menu_name': 'Settings', 'url': 'organization_settings_details',  'parent_menu_id': '1', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } ,   
        // {'menu_name': 'Functional Hierarchy', 'url': 'org_functional_hierarchy',  'parent_menu_id': '1', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } , 
        // {'menu_name': 'Perspectives', 'url': 'perspectives_details',  'parent_menu_id': '2', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },  
        // {'menu_name': 'UOM Report', 'url': 'uom_report',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } ,   
        // {'menu_name': 'Config Codes', 'url': 'config_codes_details',  'parent_menu_id': '2', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } , 
        // {'menu_name': 'Score Card', 'url': 'score_card_details',  'parent_menu_id': '0', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } , 
        // {'menu_name': 'Currencies Details', 'url': 'currencies_details',  'parent_menu_id': '6', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id } , 
        // {'menu_name': 'Actuals', 'url': 'kpi_actual_add',  'parent_menu_id': '4', 'created_by': user && user.user_id, 'last_updated_by': user && user.user_id },   

    ]

    const getUserSettings = async () => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_settings/${user.user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        let tempobj = Object.create({})
        if (res.status === 200) {
            if (data.length > 0) {
                data.forEach(temp => {
                    tempobj = { ...tempobj, [temp.variable_name]: temp.value }
                });
                setUserSettings(tempobj)
                localStorage.setItem('userSettings', JSON.stringify(tempobj))
                setPreLoading(false)
            }
        }
    }

    const fn_update_nav_menus = async () => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_navigation_menu_details`, {
            method: 'POST',
            body: JSON.stringify(nav_menus),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        // if (res.status === 400) {
        //     console.log(data)
        // }
    }
    const fn_get_session_configuration = async () => {
        let res = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/getsessionconfig`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );
        let data = await res.json();
        // let tempobj = Object.create({});
        if (res.status === 200) {
            if (data.length > 0) {
                setIdleTime(...data);
            }
        }
    };

    let contextData = {
        userSettings: userSettings,
        preloading: setPreLoading,
        fnalertClose: setclosealert,
        alertClose: closealert,
        isloading: isloading,
        setisloading: setIsLoading,
        idletime: idletime
    }

    // Start date encryption process

    const encryptData = () => {
        const data = CryptoJS.AES.encrypt(
            JSON.stringify('2023-08-14'),
            process.env.REACT_APP_SECRET_KEY
        ).toString();

        setEncrptedData(data);
        const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY);
        const dectdata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setDecrptedData(dectdata)
    };
    // console.log("encrpteddata", encrpteddata)
    // console.log("decryptdata", decryptdata)

    // End date encryption process


    const checkExpirationTime = () => {
        if (new Date(current_date) > new Date(localStorage.getItem('licenseValidity'))) {
            logoutUser()
        }
    }
    const CHECK_EXPIRATION_TIME_INTERVAL = 10000
    let interval = useRef(null);
    useEffect(() => {
        encryptData()
        checkExpirationTime()
        // decryptData()
        if (user) {
            getUserSettings()
            fn_get_session_configuration();
            // fn_update_nav_menus()
        }
        // if(localStorage.getItem('authTokens')){
        //     interval.current = setInterval(
        //         () => checkExpirationTime(),
        //         CHECK_EXPIRATION_TIME_INTERVAL
        //     );
        //     return () => clearInterval(interval.current);
        // }
    }, [preloading])

    return (
        <PreContext.Provider value={contextData}>
            {children}
            {/* {preloading ? null : children} */}

        </PreContext.Provider>
    )
}