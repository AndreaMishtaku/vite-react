import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const DataTable = (props) => {
  const {
    columns,
    rows,
    filterBy,
    actions,
    totalRecords,
    pageNumber,
    pageSize,
    onPageNumberChange,
    onPageSizeChange,
  } = props;
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: rows,
    columns: columns
      .map((c) => {
        return {
          accessorKey: c.name,
          header: c.name,
          cell: ({ row }) => (
            <div className="capitalize w-fit line-clamp-2 overflow-hidden text-ellipsis">
              {row.getValue(c.name)}
            </div>
          ),
        };
      })
      .concat(
        actions.map((a) => {
          return {
            id: a.name,
            enableHiding: false,
            cell: ({ row }) => {
              return (
                <div className="flex justify-center">
                  {React.cloneElement(a.icon, {
                    onClick: () => a.onClick(row.original),
                  })}
                </div>
              );
            },
          };
        })
      ),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full relative px-4">
      <div className="flex items-center py-4">
        <div className="flex gap-4">
          {columns.find((c) => c.name == filterBy) && (
            <Input
              placeholder={`Filter ${filterBy}...`}
              value={table.getColumn(filterBy)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn(filterBy)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {pageSize}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10].map((size, index) => {
                return (
                  <DropdownMenuItem
                    key={`size${index}`}
                    className="capitalize"
                    onClick={() => {
                      onPageSizeChange(size);
                    }}
                  >
                    {size}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border w-full relative">
        <Table className="table-auto min-w-full w-full relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex space-x-2 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPageNumberChange(pageNumber - 1);
            }}
            disabled={pageNumber == 1}
          >
            Previous
          </Button>
          <div>{pageNumber}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPageNumberChange(pageNumber + 1);
            }}
            disabled={pageNumber * pageSize > totalRecords}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
