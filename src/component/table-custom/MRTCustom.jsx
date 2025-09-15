'use client'

import React, { useRef, useState, useEffect } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_VI } from 'material-react-table/locales/vi'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import {
	Box,
	Card,
	Select,
	Tooltip,
	MenuItem,
	Pagination,
	Typography,
	IconButton
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { EmptyContent } from '../empty-content/EmptyContent'
export default function MRTCustom({
	columns,
	data,
	isLoading = false,
	rowCount,
	pagination,
	columnPinning,
	onPaginationChange,
	renderTopToolbarCustomActions,
	onRowClick,
	onSelectedRowIdsChange,
	idKey = 'id',
	enableRowSelection = false,
	onDeleteSelected,
	isTopToolbarShow = false,
	clearSelectionTrigger,
	maxHeight = '600px',
	onSelectAll
}) {
	const rowVirtualizerInstanceRef = useRef(null)
	const tableContainerRef = useRef(null)
	const [showScrollIndicator, setShowScrollIndicator] = useState(false)
	const [rowSelection, setRowSelection] = useState({})
	const [isSelectAllAcrossPages, setIsSelectAllAcrossPages] = useState(false)

	const selectedIds = Object.keys(rowSelection)
	const selectedCount = selectedIds.length
	const totalCount = rowCount ?? data.length

	useEffect(() => {
		setRowSelection({})
	}, [clearSelectionTrigger])

	useEffect(() => {
		const el = tableContainerRef.current
		if (!el) return

		const checkScroll = () => {
			const scrollHeight = el.scrollHeight
			const clientHeight = el.clientHeight
			const scrollTop = el.scrollTop

			const isOverflowing = scrollHeight > clientHeight + 1
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1

			setShowScrollIndicator(isOverflowing && !isAtBottom)
		}

		checkScroll()
		el.addEventListener('scroll', checkScroll)
		const resizeObserver = new ResizeObserver(checkScroll)
		resizeObserver.observe(el)

		return () => {
			el.removeEventListener('scroll', checkScroll)
			resizeObserver.disconnect()
		}
	}, [data, isLoading])

	const table = useMaterialReactTable({
		columns,
		data,
		getRowId: (originalRow) => String(originalRow[idKey]),
		localization: MRT_Localization_VI,
		state: {
			showSkeletons: isLoading,
			pagination,
			columnPinning: columnPinning || { left: [], right: [] },
			rowSelection
		},
		onPaginationChange,
		manualPagination: true,
		rowCount,
		enableRowSelection,
		onRowSelectionChange: enableRowSelection
			? (updater) => {
					const newState =
						typeof updater === 'function' ? updater(rowSelection) : updater

					const currentPageRowIds = table
						.getRowModel()
						.rows.map((r) => String(r.id))

					const merged = { ...rowSelection }
					currentPageRowIds.forEach((id) => {
						if (newState[id]) {
							merged[id] = true
						} else {
							delete merged[id]
						}
					})

					if (isSelectAllAcrossPages) {
						const unselectedInCurrentPage = currentPageRowIds.some(
							(id) => !newState[id]
						)
						if (unselectedInCurrentPage) {
							setIsSelectAllAcrossPages(false)
						}
					}

					setRowSelection(merged)

					const selectIds = isSelectAllAcrossPages
						? ['ALL']
						: Object.keys(merged)

					onSelectedRowIdsChange?.(selectIds)
			  }
			: undefined,
		enableStickyHeader: true,
		enableColumnResizing: true,
		enableColumnVirtualization: !isLoading,
		enableRowVirtualization: !isLoading,
		layoutMode: 'grid',
		enableColumnActions: false,
		enableColumnFilters: false,
		enableSorting: false,
		enableTopToolbar: isTopToolbarShow
			? !renderTopToolbarCustomActions
			: !!renderTopToolbarCustomActions,
		enableColumnPinning: true,
		enableColumnOrdering: false,
		defaultDisplayColumn: {
			enableResizing: true,
			grow: true
		},
		initialState: {
			density: 'compact',
			pagination: {
				pageSize: 50,
				pageIndex: 0
			},
			showGlobalFilter: true
		},
		paginationDisplayMode: 'pages',
		muiPaginationProps: {
			shape: 'rounded',
			showFirstButton: true,
			showLastButton: true,
			size: 'medium',
			sx: {
				'& .MuiPaginationItem-root': {
					fontWeight: 500,
					borderRadius: 2,
					opacity: 1,
					'&.Mui-disabled': {
						opacity: 0.4
					},
					'&:not(.Mui-selected)': {
						color: (theme) => theme.palette.text.secondary
					}
				}
			}
		},
		renderTopToolbar: ({ table: innerTable }) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: selectedCount > 0 ? 1 : 0,
					p: selectedCount > 0 ? 1 : 0
				}}
			>
				{selectedCount > 0 && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							borderRadius: 1,
							px: 1,
							py: 0.5
						}}
					>
						<Typography fontSize={14} fontWeight="bold">
							{isSelectAllAcrossPages
								? `Đã chọn ${totalCount} trên ${totalCount} dòng`
								: `Đã chọn ${selectedCount} trên ${totalCount} dòng`}
						</Typography>

						{!isSelectAllAcrossPages &&
							selectedCount > 0 &&
							selectedCount < totalCount && (
								<Typography
									fontSize={14}
									sx={{
										mx: 2,
										color: 'primary.main',
										textDecoration: 'underline',
										cursor: 'pointer'
									}}
									onClick={() => {
										setIsSelectAllAcrossPages(true)
										onSelectedRowIdsChange?.(['ALL'])
										onSelectAll?.()
									}}
								>
									Chọn tất cả {totalCount} dòng dữ liệu
								</Typography>
							)}

						<Tooltip title="Xóa dòng dữ liệu">
							<IconButton
								color="primary"
								onClick={() => onDeleteSelected?.(selectedIds)}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					</Box>
				)}
				{renderTopToolbarCustomActions?.({ table: innerTable })}
			</Box>
		),
		renderBottomToolbar: ({ table: innerTable }) => {
			const { pageIndex, pageSize } = innerTable.getState().pagination
			const localRowCount =
				innerTable.options.rowCount ?? innerTable.getRowModel().rows.length
			const from = pageIndex * pageSize + 1
			const to = Math.min((pageIndex + 1) * pageSize, localRowCount)

			return (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'right',
						alignItems: 'center',
						px: 2,
						py: 1,
						flexWrap: 'wrap',
						rowGap: 1,
						columnGap: 2,
						borderTop: '1px solid #e0e0e0'
					}}
				>
					<Typography fontSize={14}>
						Hiển thị {from}–{to} trên {localRowCount}
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Select
							size="small"
							value={pageSize}
							onChange={(e) =>
								innerTable.options.onPaginationChange?.((old) => ({
									...old,
									pageSize: parseInt(e.target.value, 10),
									pageIndex: 0
								}))
							}
						>
							{[5, 10, 20, 25, 30, 50, 100].map((size) => (
								<MenuItem key={size} value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
						/ Trang
						<Pagination
							{...innerTable.options.muiPaginationProps}
							count={Math.ceil(localRowCount / pageSize)}
							page={pageIndex + 1}
							onChange={(_, newPage) =>
								innerTable.options.onPaginationChange?.((old) => ({
									...old,
									pageIndex: newPage - 1
								}))
							}
						/>
					</Box>
				</Box>
			)
		},
		muiTableHeadCellProps: {
			sx: (theme) => ({
				py: 1.5,
				px: 1.5,
				fontWeight: 700,
				color: theme.palette.grey[900],
				backgroundColor: theme.palette.grey[300]
			})
		},
		muiTableContainerProps: {
			ref: tableContainerRef,
			sx: {
				height: 'auto',
				minHeight: '100px',
				maxHeight,
				overflow: 'auto',
				position: 'relative'
			}
		},
		muiSkeletonProps: {
			animation: 'pulse',
			sx: {
				backgroundColor: (theme) => theme.palette.grey[200],
				borderRadius: 1
			}
		},
		rowVirtualizerInstanceRef,
		rowVirtualizerOptions: {
			overscan: 5
		},
		columnVirtualizerOptions: {
			overscan: 2
		},
		muiTableBodyRowProps: ({ row }) => ({
			onClick: () => {
				onRowClick?.(row.original)
			},
			sx: {
				cursor: onRowClick ? 'pointer' : 'default',
				'&:hover': onRowClick
					? {
							backgroundColor: (theme) => theme.palette.action.hover
					  }
					: undefined
			}
		})
	})

	return (
		<>
			{data?.length === 0 && !isLoading ? (
				<EmptyContent title="Không có dữ liệu" filled sx={{ py: 10 }} />
			) : (
				<Card
					sx={{
						border: 1,
						borderColor: 'divider',
						boxShadow: 6
					}}
				>
					<MaterialReactTable table={table} />
					{showScrollIndicator && !isLoading && (
						<Box
							onClick={() =>
								tableContainerRef.current?.scrollTo({
									top: tableContainerRef.current.scrollHeight,
									behavior: 'smooth'
								})
							}
							sx={{
								cursor: 'pointer',
								position: 'absolute',
								bottom: 70,
								left: '50%',
								transform: 'translateX(-50%)',
								backgroundColor: 'primary.main',
								color: '#fff',
								borderRadius: 999,
								px: 2,
								py: 0.75,
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								fontSize: 13,
								fontWeight: 500,
								boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
								border: '1px solid rgba(255,255,255,0.4)',
								zIndex: 10
							}}
						>
							<KeyboardArrowDown fontSize="small" />
							Cuộn xuống
						</Box>
					)}
				</Card>
			)}
		</>
	)
}
