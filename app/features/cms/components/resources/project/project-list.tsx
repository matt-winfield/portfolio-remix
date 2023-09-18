import {
    ChipField,
    Datagrid,
    ImageField,
    List,
    ReferenceArrayField,
    RichTextField,
    SingleFieldList,
    TextField,
    UrlField,
} from 'react-admin';

export const ProjectList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="name" />
            <RichTextField source="description" className="rich-text" />
            <UrlField source="codeUrl" />
            <UrlField source="demoUrl" />

            <ReferenceArrayField
                label="Images"
                reference="image"
                source="imageIds"
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
            <ReferenceArrayField
                label="Technologies"
                reference="technology"
                source="technologyIds"
            >
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
