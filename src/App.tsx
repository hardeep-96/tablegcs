import { MenuItem, TextField } from '@material-ui/core'
import React, { useEffect } from 'react'
import axios from 'axios'
import { FilterProps } from 'react-table'
import { Table } from './Table'
import { PersonData, dataArr } from './utils'
import './App.css'





function SelectColumnFilter({
  column: { filterValue, render, setFilter, preFilteredRows, id },
}: FilterProps<PersonData>) {
  const options = React.useMemo(() => {
    const options = new Set<any>()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...Array.from(options.values())]
  }, [id, preFilteredRows])

  return (
    <TextField
      select
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
    >
      <MenuItem value={''}>All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

const columns = [
  {
    Header: 'Info',
    columns: [
      {
        Header: 'Id',
        accessor: 'id',
        width: 50,
        minWidth: 50,
        disableGroupBy: true,
        disableFilters: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
        filter: 'fuzzyText',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: SelectColumnFilter,
        filter: 'includes',
        disableSortBy: true,
      },
      {
        Header: 'Description',
        accessor: 'description',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Delta',
        accessor: 'delta',
        width: 50,
        minWidth: 50,
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'CreatedOn',
        accessor: 'createdOn',
        disableFilters: true,
        Cell: (ce: any) => <span>{ce.value && new Date(ce.value).toDateString()}</span>,
      },
    ],
  },
].flatMap((c: any) => c.columns) // to drop header groups

interface User {
  id: number
  firstName: string
}

const App: React.FC = () => {
  let data = dataArr

  useEffect(() => {
    // axios.get<User[]>('https://jsonplaceholder.typicode.com/posts').then((response) => {
    //   console.log(response.data)
    // })

    

    // curly.get('https://storage.googleapis.com/king-airnd-recruitment-sandbox-data/data.json')
  })

  return (
    <div className='main'>
      <Table<PersonData> name={'testTable'} columns={columns} data={dataArr} />
    </div>
  )
}

export default App
