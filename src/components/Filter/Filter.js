import React from 'react';

const Filter = ({value,onChange}) =>
  <form>
    <input type="text" className="width100"  placeholder="filter your list by title" value={value} onChange={onChange}/>
  </form>

export default Filter