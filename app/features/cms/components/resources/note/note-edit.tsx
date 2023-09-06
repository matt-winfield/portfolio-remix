import {
    AutocompleteArrayInput,
    DateInput,
    Edit,
    ReferenceArrayInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const NoteEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" />
            <TextInput source="content" />
            <DateInput source="createdAt" />
            <DateInput source="updatedAt" />
            <ReferenceInput source="ownerId" reference="User" />
            <ReferenceArrayInput
                label="Images"
                reference="noteImage"
                source="imageIds"
            >
                <AutocompleteArrayInput optionText={'altText'} />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);
