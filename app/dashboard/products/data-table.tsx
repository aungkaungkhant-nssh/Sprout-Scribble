"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableRow, TableHeader, TableBody, TableCell, TableHead } from "@/components/ui/table"
import {
    flexRender, useReactTable, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export function DataTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // onColumnFiltersChange: setColumnFilters,
        // state: {
        //     sorting,
        //     columnFilters,
        // },
    })
    return (
        <div className="rounded-md border">
            <Card>
                <CardHeader>Your Products</CardHeader>
                <CardDescription></CardDescription>
                <CardContent>
                    <div>
                        <div>
                            <Input
                                placeholder="Filter products"
                                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("title")?.setFilterValue(event.target.value)
                                }
                            />
                        </div>
                        <Table>
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
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
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
                        <div className="flex justify-end gap-4 items-center pt-4">
                            <Button
                                disabled={!table.getCanPreviousPage()}
                                onClick={() => table.nextPage()}
                                variant={"outline"}
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                <span>Previous Page</span>
                            </Button>
                            <Button
                                disabled={!table.getCanNextPage()}
                                onClick={() => table.nextPage()}
                                variant={"outline"}
                            >
                                <span>Next Page</span>
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}