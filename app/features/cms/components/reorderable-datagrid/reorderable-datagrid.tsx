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
import {
    Checkbox,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Children, isValidElement, useCallback, useState } from 'react';
import {
    Datagrid,
    type DatagridRowProps,
    type DatagridBodyProps,
    type DatagridProps,
    DatagridRow,
    DatagridClasses,
    useDataProvider,
    useListContext,
    type DatagridHeaderProps,
    DatagridHeaderCell,
    useRefresh,
} from 'react-admin';
import { useMutation } from 'react-query';
import { Button } from '#app/components/ui/button.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { cn } from '#app/utils/misc.tsx';

interface ReorderableDataGridProps extends DatagridProps {}

export const ReorderableDataGrid = ({ ...props }: ReorderableDataGridProps) => {
    const dataProvider = useDataProvider();
    const { resource, data } = useListContext();
    const refresh = useRefresh();

    const mappedData =
        data?.map((record) => record.id as UniqueIdentifier) ?? [];
    const [ids, setIds] = useState(mappedData);

    const hasChanges = ids.some((id, index) => id !== mappedData[index]);

    const { mutate, isLoading } = useMutation(() => {
        const result = dataProvider.update(resource, {
            id: 'list',
            data: { ids },
            previousData: { ids: mappedData },
        });
        refresh();
        return result;
    });

    return (
        <div>
            <Datagrid
                {...props}
                body={<ReorderableDataGridBody onItemsReordered={setIds} />}
                header={<ReorderableDataGridHeader />}
            />
            <Button
                className="m-2"
                disabled={!hasChanges || isLoading}
                onClick={() => mutate()}
            >
                Save
            </Button>
        </div>
    );
};

// Re-implementation of DatagridHeader to add column for drag handle
export const ReorderableDataGridHeader = ({
    hasBulkActions,
    isRowSelectable,
    className,
    children,
}: DatagridHeaderProps) => {
    const { resource, onSelect, selectedIds, data } = useListContext();
    const selectableIds = Array.isArray(data)
        ? isRowSelectable
            ? data
                  .filter((record) => isRowSelectable(record))
                  .map((record: any) => record.id)
            : data.map((record: any) => record.id)
        : [];

    const handleSelectAll = useCallback(
        (event: { target: { checked: boolean } }) =>
            onSelect(
                event.target.checked
                    ? selectedIds.concat(
                          data
                              .filter(
                                  (record) => !selectedIds.includes(record.id),
                              )
                              .filter((record) =>
                                  isRowSelectable
                                      ? isRowSelectable(record)
                                      : true,
                              )
                              .map((record) => record.id),
                      )
                    : [],
            ),
        [data, onSelect, isRowSelectable, selectedIds],
    );

    return (
        <TableHead className={cn(className, DatagridClasses.thead)}>
            <TableRow
                className={cn(DatagridClasses.row, DatagridClasses.headerRow)}
            >
                {hasBulkActions && selectedIds && (
                    <TableCell
                        padding="checkbox"
                        className={DatagridClasses.headerCell}
                    >
                        <Checkbox
                            aria-label="Select all"
                            className="select-all"
                            color="primary"
                            checked={
                                selectedIds.length > 0 &&
                                selectableIds.length > 0 &&
                                selectableIds.every((id) =>
                                    selectedIds.includes(id),
                                )
                            }
                            onChange={handleSelectAll}
                        />
                    </TableCell>
                )}
                {Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <DatagridHeaderCell
                            className={cn(
                                DatagridClasses.headerCell,
                                `column-${(field.props as any).source}`,
                            )}
                            field={field}
                            sort={{ field: 'order', order: 'ASC' }}
                            isSorting={false}
                            key={(field.props as any).source || index}
                            resource={resource}
                        />
                    ) : null,
                )}
                {/* Extra cell for drag handle column */}
                <TableCell
                    className={cn('w-0', DatagridClasses.headerCell)}
                ></TableCell>
            </TableRow>
        </TableHead>
    );
};

interface ReorderableDataGridBodyProps extends DatagridBodyProps {
    onItemsReordered?: (ids: UniqueIdentifier[]) => void;
}

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
            props.onItemsReordered?.(reordered);
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
        <DatagridRow {...props} ref={setNodeRef} style={style}>
            {props.children}
            <Icon
                className="cursor-move"
                name="drag-handle"
                {...attributes}
                {...listeners}
            />
        </DatagridRow>
    );
};
