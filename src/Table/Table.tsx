import { TableSortLabel, TextField } from '@material-ui/core'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import cx from 'classnames'
import React, { CSSProperties, PropsWithChildren, ReactElement, useEffect } from 'react'
import {
  Cell,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Meta,
  Row,
  TableOptions,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

import { camelToWords, useDebounce, useLocalStorage } from '../utils'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { TablePagination } from './TablePagination'
import { useStyles } from './TableStyles'
import { TableToolbar } from './TableToolbar'
import { TooltipCell } from './TooltipCell'

export interface Table<T extends object = {}> extends TableOptions<T> {
  name: string
  onClick?: (row: Row<T>) => void
}

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

function DefaultColumnFilter<T extends object>({
  column: { id, index, filterValue, setFilter, render, parent },
}: FilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const firstIndex = !(parent && parent.index)
  return (
    <TextField
      name={id}
      label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}
      variant={'standard'}
      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined)
      }}
    />
  )
}

const getStyles = <T extends object>(props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]


const headerProps = <T extends object>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column && column.disableResizing, column && column.align)

const cellProps = <T extends object>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align)

const defaultColumn = {
  Filter: DefaultColumnFilter,
  Cell: TooltipCell,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  useFlexLayout,
  usePagination,
]

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

export function Table<T extends object>(props: PropsWithChildren<Table<T>>): ReactElement {
  const { name, columns, onClick } = props
  const classes = useStyles()

  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {})
  const instance = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
    },
    ...hooks
  )

  const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns,
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && cell.column.id !== '_selector' && onClick(cell.row)
  }

  return (
    <>
      <TableToolbar instance={instance} />
      <div className={classes.tableTable} {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className={classes.tableHeadRow}>
              {headerGroup.headers.map((column) => {
                const style = {
                  textAlign: column.align ? column.align : 'left ',
                } as CSSProperties
                return (
                  <div {...column.getHeaderProps(headerProps)} className={classes.tableHeadCell}>
                    {column.canSort ? (
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                        {...column.getSortByToggleProps()}
                        className={classes.tableSortLabel}
                        style={style}
                      >
                        {column.render('Header')}
                      </TableSortLabel>
                    ) : (
                      <div style={style} className={classes.tableLabel}>
                        {column.render('Header')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className={classes.tableBody}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <div {...row.getRowProps()} className={cx(classes.tableRow, { rowSelected: row.isSelected })}>
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps(cellProps)}
                      onClick={cellClickHandler(cell)}
                      className={classes.tableCell}
                    >
                      {cell.isGrouped ? (
                        <>
                          <TableSortLabel
                            classes={{
                              iconDirectionAsc: classes.iconDirectionAsc,
                              iconDirectionDesc: classes.iconDirectionDesc,
                            }}
                            active
                            direction={row.isExpanded ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowUp}
                            {...row.getToggleRowExpandedProps()}
                            className={classes.cellIcon}
                          />{' '}
                          {cell.render('Cell')} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <TablePagination<T> instance={instance} />
    </>
  )
}
