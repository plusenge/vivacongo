import React from 'react'

const NotFoundSearch = () => {
  return (
    <div className="p-3 mt-3" style={{ backgroundColor: "#f8d7da" }}>
      <h5>Sorry, we could not find any results for your search...</h5>
      <span>Following tips might help you to get better results</span>
      <ul>
        <li>Use more general keywords</li>
        <li>Check spelling of position</li>
        <li>Reduce filters, use less of them</li>
      </ul>
    </div>
  );
}

export default NotFoundSearch