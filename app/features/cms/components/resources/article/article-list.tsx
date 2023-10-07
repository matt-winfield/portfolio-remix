import {
    BooleanField,
    Datagrid,
    ImageField,
    List,
    ReferenceArrayField,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const ArticleList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="title" />
            <TextField source="slug" />
            <BooleanField source="draft" />
            <TextField source="description" />
            <TextField source="tags" />
            <ReferenceArrayField
                label="Images"
                reference="image"
                source="imageIds"
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
