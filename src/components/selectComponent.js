/* =========================================================================================================================

   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   21-MAR-2023  Jagadeshwaran R      Initial Version             V1

   ** This Select Component contains of multi select values**

==========================================================================================================================*/

import 'bootstrap/dist/css/bootstrap.css';
import Select from 'react-select';

//this functional component takes values as props for another component
const FnSelectComponent = ({values,labels,query,setQuery,multiselect}) => {
  let options=[];

  for(let i=0;i<values.length;i++){
    options.push({value:values[i],label:labels[i].toUpperCase()})
  }
  
  return(
  <div className='sc_cl_div d-flex flex-column flex-lg-row flex-sm-column justify-content-start'>
    {
    multiselect ? // checks for multi select inputs
    <Select
      className='dropdown w-75'
      placeholder="Select Option"
      value={options.filter(obj => query.includes(obj.value))} //
      defaultValue={options}
      options={options}
      onChange={e=>setQuery(Array.isArray(e) ? e.map(x => x.value) : [])}
      isMulti
      isClearable
      isSearchable
    />
    :
    <Select
      className='dropdown w-75'
      placeholder="Select Option"
      value={options.filter(obj => query.includes(obj.value))}
      options={options}
      onChange={e=>setQuery(e.value)}
    />
    }
  </div>
);
  
};

export default FnSelectComponent;