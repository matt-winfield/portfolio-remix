import {
    ChipField,
    ImageField,
    List,
    ReferenceArrayField,
    RichTextField,
    SingleFieldList,
    TextField,
    UrlField,
} from 'react-admin';
import { ReorderableDataGrid } from '../../reorderable-datagrid/reorderable-datagrid.tsx';

export const ProjectList = () => (
    <List>
        <ReorderableDataGrid rowClick="show">
            <TextField source="name" sortable={false} />
            <RichTextField
                source="description"
                className="rich-text"
                sortable={false}
            />
            <UrlField source="codeUrl" sortable={false} />
            <UrlField source="demoUrl" sortable={false} />

            <ReferenceArrayField
                label="Images"
                reference="image"
                source="imageIds"
                sortable={false}
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
            <ReferenceArrayField
                label="Technologies"
                reference="technology"
                source="technologyIds"
                sortable={false}
            >
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
        </ReorderableDataGrid>
    </List>
);
