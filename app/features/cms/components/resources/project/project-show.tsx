import {
    ChipField,
    ImageField,
    ReferenceArrayField,
    RichTextField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    UrlField,
} from 'react-admin';

export const ProjectShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField source="slug" />
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
        </SimpleShowLayout>
    </Show>
);
