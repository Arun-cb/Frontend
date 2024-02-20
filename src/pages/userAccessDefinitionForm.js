import React ,{useState, useContext, useEffect} from 'react'
import AuthContext from "../context/AuthContext";
import { Col, Container, Row, Form, Table} from 'react-bootstrap';
 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Tableact from '../components/tableComponent';

const FnUserAccessDefinitionForm = () => {
    let { authTokens, user } = useContext(AuthContext);
    const [adata, setAdata] = useState({
         "created_by": user.user_id, 
         "last_updated_by": user.user_id,
         add:'N', view:'N', edit:'N', delete:'N'
        })
    const [alluser, setAlluser] = useState([])
    const [existpermissions, setExistPermissions] = useState({})
    const [selectedid, setSelectedid] = useState(null)
    const [load, setLoad] = useState(false)
    const [allselected, setAllselected] = useState(true)
    const [inputs, setInputs] = useState({})
    const [menus, setMenus] = useState([])
    const [deletedisablemenu, setDeletedisablemenu] = useState(null)
    const [error, setError] = useState({})
    const navigator = useNavigate()
    let deleted = ''
    const columns_to=['Menu Name','Permissions']

    const getUserDetails = async() => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_user_details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 200) {
            if (data.length > 0) {
                setAlluser(data)
            }
        }
    }

    const getMenusDeatils = async() => {
        let mres = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_navigation_menu_details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let mdata = await mres.json();
        if (mres.status === 200) {
            if (mdata.length > 0) {
                mdata.map(m => {
                    if(m.menu_name === 'Functional Level'){
                        setDeletedisablemenu(m.menu_id)
                    }
                })
                setMenus(mdata)
            }
        }
    }

    const fn_update_details = async() => {
        const [update_menu] = Object.keys(inputs).filter(list => inputs[list].item === 'new')
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/upd_user_access_definition/${selectedid}/`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 200) {
            Swal.fire({
                icon: 'success',
                // title: 'Updated',
                text: 'Updated Successfully!',
            }).then(function () {
                setError()
                // setAction(false)
            });
            // setLoad('')
        } else {
            setError(data)
        }
    }

    const fn_submit_details = async() => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_user_access`, {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 201) {
            Swal.fire({
                icon: 'success',
                // title: 'Updated',
                text: 'User Access Added Successfully...',
            }).then(function () {
                setError()
            });
        } else {
            setError(data)
            setInputs({})
        }
    }

    const Existpremissiondetails = async(id) => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/join_user_user_access/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        const tempobj = Object.create({})
        if (res.status === 200) {
            if (data.length >= 0) {
                setExistPermissions(data)
                if(data.length === 0){
                    setAllselected(false)
                }
                data.forEach(temp => {
                    tempobj[temp.menu_id] = {...temp, user_id:id}
                    if(temp.add === "N" || temp.edit === "N" || temp.view === "N" || temp.delete === "N"){
                        if(temp.menu_id === deletedisablemenu){
                            setAllselected(true)
                        }else{
                            setAllselected(false)
                        }
                    }
                });
            }
            setInputs(tempobj)
        }
    }

    const fn_get_permisstion = (id) => {
        setError({})
        setAllselected(true)
        setSelectedid(id)
        Existpremissiondetails(id)
    }
    
    useEffect(()=> {
        if(load === false){
            getMenusDeatils()
            getUserDetails()
            
            // setInputs({})
        }else{
            setLoad(false)
        }
        
    },[load])

    const InputHandler = (e, mid) => {
        if(!inputs[mid]){
            menus.forEach(temp =>{
                if(temp.menu_id === mid){
                    inputs[temp.menu_id] = {...adata, menu_id: temp.menu_id,user_id:selectedid,[e.target.name]: e.target.value}
                }else if(!inputs[temp.menu_id]){
                    inputs[temp.menu_id] = {...adata, menu_id: temp.menu_id,user_id:selectedid}
                }else{
                    inputs[temp.menu_id] = {...inputs[temp.menu_id], menu_id: temp.menu_id,user_id:selectedid}
                }
            })
            setLoad(true)
        }else{
            inputs[mid] = {...inputs[mid], [e.target.name]: e.target.value}
            setLoad(true)
        }
    }


    const SelectAll = () =>{
        if(allselected){
            menus.forEach(temp =>{
            inputs[temp.menu_id] = {...inputs[temp.menu_id], menu_id: temp.menu_id,user_id:selectedid, add: 'N',edit: 'N',view: 'N',delete: 'N'}
            })
            setLoad(true)
            setAllselected(false)
        }else{
            menus.forEach(temp =>{
                if(temp.menu_id === deletedisablemenu){
                    inputs[temp.menu_id] = {...adata, menu_id: temp.menu_id,user_id:selectedid, add: 'Y',edit: 'Y',view: 'Y',delete: 'N'}
                }else if(!inputs[temp.menu_id]){
                    inputs[temp.menu_id] = {...adata, menu_id: temp.menu_id,user_id:selectedid, add: 'Y',edit: 'Y',view: 'Y',delete: 'Y'}
                }else{
                    inputs[temp.menu_id] = {...inputs[temp.menu_id],menu_id: temp.menu_id,user_id:selectedid, add: 'Y',edit: 'Y',view: 'Y',delete: 'Y'}
                }
            })
            setLoad(true)
            setAllselected(true)
        }
        
    }


    return (
            <>
                <div className='sc_cl_row'>
                    <div className='p-2'>
                        <h3 className='sc_cl_h3'>Menu Details</h3>
                    </div>
                </div>


                <hr className='sc_cl_hr'></hr>

                <div className='sc_cl_row'>
                    <div className='sc_cl_col'><label style={{ fontWeight: 'bold' }}>User</label></div>
                </div>

                <div className='sc_cl_row'>
                    <div className='sc_cl_col'>
                        <select name="user_id" className='sc_cl_input'
                        onChange={(e)=>fn_get_permisstion(e.target.value)}>
                            <option value={0} hidden>---Select---</option>
                            {
                                alluser.map((temp) =>( 
                                    <option key={temp.id} value={temp.id}>{temp.username}</option>
                                ))
                            }
                        </select>
                        <span className='red'>{error && error.user_id}</span>
                    </div>
                </div>
                {
                    existpermissions.length >= 0 &&
                    <>
                <div className='sc_cl_row'>
                    <div className='sc_cl_col mt-2'>
                    <label>
                    <input
                        name="selectall"
                        type='checkbox'
                        className='m-1'
                        checked={allselected ? true : null || ''}
                        onChange={SelectAll}
                        // id='inline-checkbox-2'
                    />Select All</label>
                    <Table className='sc_cl_table'>
                        <thead>
                            <tr>
                                <th>Menu Name</th>
                                <th>Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                menus.map(temp => 
                                    <tr key={temp.menu_id}>
                                        <td>{temp.menu_name}</td>
                                        <td>
                                            <div className='sc_cl_checkbox'>
                                            <label >
                                            <input 
                                                type="checkbox"
                                                name="add"
                                                className='m-1 sc_cl_input_checkbox'
                                                // id="vehicle1"
                                                value={inputs[temp.menu_id] && inputs[temp.menu_id].add === 'Y' ? 'N':'Y'}
                                                checked={inputs[temp.menu_id] && (inputs[temp.menu_id].add === 'Y' ? true : null) || '' } 
                                                onChange={(e)=>InputHandler(e, temp.menu_id)}
                                                // autoComplete='on'
                                                // id={`inline-checkbox-1`}
                                            /> Add</label>
                                            </div>
                                            <div className='sc_cl_checkbox'>
                                            <label> 
                                            <input
                                                name="edit"
                                                type='checkbox'
                                                className='m-1'
                                                checked={inputs[temp.menu_id] && (inputs[temp.menu_id].edit === 'Y' ? true : null) || ''}
                                                // checked={inputs[temp.menu_id] && inputs[temp.menu_id].edit === 'Y' }
                                                value={inputs[temp.menu_id] && inputs[temp.menu_id].edit === 'Y' ? 'N':'Y'}
                                                onChange={(e)=>InputHandler(e, temp.menu_id)}
                                                // id='inline-checkbox-2'
                                            />Edit</label>
                                            </div>
                                            <div className='sc_cl_checkbox'>
                                            <label>
                                            <input 
                                                name="view"
                                                type='checkbox'
                                                className='m-1'
                                                // value='Y'
                                                // defaultChecked={inputs[temp.menu_id] && inputs[temp.menu_id].view === 'Y'}
                                                checked={inputs[temp.menu_id] && (inputs[temp.menu_id].view === 'Y' ? true : null) || ''}
                                                value={inputs[temp.menu_id] && inputs[temp.menu_id].view === 'Y' ? 'N':'Y'}
                                                onChange={(e)=>InputHandler(e, temp.menu_id)}
                                                // id={`inline-checkbox-3`}
                                            /> View</label>
                                            </div>
                                            <div className='sc_cl_checkbox'>
                                            <label> 
                                            <input 
                                                name="delete"
                                                type='checkbox'
                                                className='m-1'
                                                value={inputs[temp.menu_id] && inputs[temp.menu_id].delete === 'Y' ? 'N':'Y'}
                                                checked={inputs[temp.menu_id] && (inputs[temp.menu_id].delete === 'Y' ? true : null) || ''}
                                                onChange={(e)=>InputHandler(e, temp.menu_id)}
                                                disabled = {temp.menu_id === deletedisablemenu ? true : false}
                                                // id={`inline-checkbox-4`}
                                            />Delete</label>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        </Table>
                        </div>
                    </div>
                    <Row>
                        <Col className='col mt-2'>
                            {
                                existpermissions.length > 0 
                                ? <input type="submit" value='Update' onClick={fn_update_details} className="btn btn-sm btn-dark" />
                                : <input type="submit" value='Submit' onClick={fn_submit_details} className="btn btn-sm btn-dark" />

                            }
                            <input type="button" value='Close' onClick={() => navigator('/')} className="btn btn-sm btn-light m-2" />
                        </Col>
                    </Row>
                    </>
                }
            </>
    )
}

export default FnUserAccessDefinitionForm