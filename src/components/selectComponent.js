/* =========================================================================================================================

   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   21-MAR-2023  Jagadeshwaran R      Initial Version             V1

   ** This Select Component contains of multi select values**

==========================================================================================================================*/

import 'bootstrap/dist/css/bootstrap.css';
import Select from 'react-select';

//this functional component takes values as props for another component
const FnSelectComponent = ({ values, labels, query, setQuery, error, fullQuery, queryIdx, temp, multiselect, multiIndex, setTemp, PlaceHolder}) => {
  // console.log('PlaceHolder', PlaceHolder)
  let options = [];

  for (let i = 0; i < values.length; i++) {
    options.push({ value: values[i], label: labels[i].toUpperCase() })
  }

  const userinputhandler = (e) => {
    if (multiIndex === true) {
      let tempkpidata = fullQuery
      let listtest = []
      if (Array.isArray(e)) {
        e.map(x => listtest.push(x.value))
      }
      tempkpidata[queryIdx].kpiUser = listtest
      setQuery(tempkpidata)
      setTemp(!temp)
    } else {
      setQuery(Array.isArray(e) ? e.map(x => x.value) : [])
    }
  }

  return (
    <div className='sc_cl_div d-flex flex-column flex-lg-row flex-sm-column justify-content-start'>
      {
        multiselect ? // checks for multi select inputs
          <Select
            className='dropdown w-100'
            placeholder={PlaceHolder ? PlaceHolder :"Select Option"}
            value={options.filter(obj => query.includes(obj.value))} //
            defaultValue={options}
            options={options}
            onChange={e => userinputhandler(e)}
            maxMenuHeight={200} 
            isMulti
            isClearable
            isSearchable
          />
          :
          <Select
            className='dropdown w-100'
            placeholder={PlaceHolder ? PlaceHolder :"Select Option"}
            value={options.filter(obj =>obj.value === query)}
            maxMenuHeight={200} 
            options={options}
            onChange={e => {
              error();
              setQuery(e.value)
            }}
          />
      }
    </div>
  );

};

export default FnSelectComponent;