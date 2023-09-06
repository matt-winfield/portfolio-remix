import {
    ImageField,
    ReferenceArrayField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const NoteShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="content" />
            <ReferenceField source="ownerId" reference="User" />
            <ReferenceArrayField
                label="Images"
                reference="noteImage"
                source="imageIds"
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);
