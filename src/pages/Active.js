import React, { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext";


function Active() {
    let { authTokens, logoutUser } = useContext(AuthContext);
    const [empdetails, setEmpdetails] = useState([]);
    const [loader, setLoader] = useState();
    const [inputs, setInputs] = useState({ Year: "", Month: "" });

    const GetDetails = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/getempregdetails`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 200) {
            setEmpdetails(data)
        }
    }


    const ChangeStatus = async (e, status) => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/update_profile/${e.target.value}/`, {
            method: 'PUT',
            body: JSON.stringify({ 'is_active': status }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },

        })
        let data = await res.json();
        if (res.status === 200) {
            // setEmpdetails(data)
            setLoader(status)
        }
    }



    useEffect(() => {
        GetDetails()
        setLoader()
    }, [loader])



    return (
        <>
            <div className="m-4">
                <h2>Change User Active Status</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Firstname</th>
                            <th>lastname</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            empdetails.length > 0
                                ? empdetails.map(data => (
                                    <tr key={data.id}>
                                        <td>{data.username}</td>
                                        <td>{data.email}</td>
                                        <td>{data.first_name}</td>
                                        <td>{data.last_name}</td>
                                        <td>{
                                            data.is_active === true
                                                ? <button type="click" value={data.id} onClick={(e) => ChangeStatus(e, false)} className="btn-active">Active</button>
                                                : <button type="click" value={data.id} onClick={(e) => ChangeStatus(e, true)} className="btn-inactive">Inactive</button>
                                        }
                                        </td>
                                    </tr>
                                ))
                                : <tr className="text-center"><td>No Data Found</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default Active