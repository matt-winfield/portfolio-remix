import {
    DndContext,
    useSensors,
    type UniqueIdentifier,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableBody } from '@mui/material';
import { useState } from 'react';
import {
    Datagrid,
    type DatagridRowProps,
    type DatagridBodyProps,
    type DatagridProps,
    DatagridRow,
    DatagridClasses,
} from 'react-admin';
import { cn } from '#app/utils/misc.tsx';

interface ReorderableDataGridProps extends DatagridProps {}

export const ReorderableDataGrid = ({ ...props }: ReorderableDataGridProps) => {
    return <Datagrid {...props} body={<ReorderableDataGridBody />} />;
};

interface ReorderableDataGridBodyProps extends DatagridBodyProps {}

export const ReorderableDataGridBody = ({
    ref,
    data,
    className,
    onToggleItem,
    resource,
    rowClick,
    isRowSelectable,
    selectedIds,
    rowSx,
    rowStyle,
    expand,
    hasBulkActions,
    hover,
    children,
    ...props
}: ReorderableDataGridBodyProps) => {
    const mappedData =
        data?.map((record, rowIndex) => {
            return (record.id as UniqueIdentifier) ?? `row-${rowIndex}`;
        }) ?? [];
    const [ids, setIds] = useState(mappedData);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            if (!over) return;

            const oldIndex = ids.indexOf(active.id);
            const newIndex = ids.indexOf(over.id);

            const reordered = [...ids];
            reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, active.id);

            setIds(reordered);
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={ids}>
                <TableBody
                    ref={ref}
                    className={cn(
                        'datagrid-body',
                        className,
                        DatagridClasses.tbody,
                    )}
                    {...props}
                >
                    {ids.map((id, rowIndex) => {
                        const record = data?.find((r) => r.id === id);
                        if (!record) return null;

                        return (
                            <ReorderableDataGridRow
                                className={cn(DatagridClasses.row, {
                                    [DatagridClasses.rowEven]:
                                        rowIndex % 2 === 0,
                                    [DatagridClasses.rowOdd]:
                                        rowIndex % 2 !== 0,
                                })}
                                expand={expand}
                                hasBulkActions={hasBulkActions && !!selectedIds}
                                hover={hover}
                                id={record.id ?? `row${rowIndex}`}
                                key={record.id ?? `row${rowIndex}`}
                                onToggleItem={onToggleItem}
                                record={record}
                                resource={resource}
                                rowClick={rowClick}
                                selectable={
                                    !isRowSelectable || isRowSelectable(record)
                                }
                                selected={selectedIds?.includes(record.id)}
                                sx={rowSx?.(record, rowIndex)}
                                style={rowStyle?.(record, rowIndex)}
                            >
                                {children}
                            </ReorderableDataGridRow>
                        );
                    })}
                </TableBody>
            </SortableContext>
        </DndContext>
    );
};

interface ReorderableDataGridRowProps extends DatagridRowProps {}

export const ReorderableDataGridRow = ({
    ...props
}: ReorderableDataGridRowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props.record?.id as UniqueIdentifier });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <DatagridRow
            {...props}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        />
    );
};
