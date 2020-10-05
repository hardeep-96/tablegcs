import { CssBaseline, MenuItem, TextField } from '@material-ui/core'
import React from 'react'
import { FilterProps } from 'react-table'

import { Page } from './Page'
import { Table } from './Table'
import { PersonData, makeData } from './utils'

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
        Cell: (ce: any) =>  <span>{ce.value && new Date(ce.value).toDateString()}</span>,
      },
    ],
  },
].flatMap((c:any)=>c.columns) // to drop header groups

const App: React.FC = () => {
  const [data] = React.useState<PersonData[]>(() => makeData(100))


  return (
    <Page>
      <CssBaseline />
      <Table<PersonData>
        name={'testTable'}
        columns={columns}
        data={data}
      />
    </Page>
  )
}

export default App
