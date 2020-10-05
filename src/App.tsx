import React from 'react';
import {
  Cell,
  CellProps,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';

const columns = [
  
  {
    Header: 'Info',
    columns: [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Delta',
        accessor: 'delta',
      },
      {
        Header: 'CreatedOn',
        accessor: 'createdOn',
      },
    ],
  },
] 

const data = [
  {
      "id": "horn-od926",
      "name": "test1",
      "status": 200,
      "description": "sdfsdfsdfsdfsdfsdf",
      "delta": 39,
      "createdOn": "01-01-2000"
  },
]

interface PersonData{
  
    "id": String,
    "name": String,
    "status": Number,
    "description": String,
    "delta": Number,
    "createdOn": String

}

const App: React.FC = () => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
} = useTable({
    columns,
    data,
})

return (
  <table className="table" {...getTableProps()}>
  <thead>
      {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
          </tr>
      ))}
  </thead>
  <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
          prepareRow(row)
          return (
              <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
              </tr>
          )
      })}
  </tbody>
</table>
)
}
export default App;
