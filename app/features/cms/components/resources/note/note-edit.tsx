import {
    DateInput,
    Edit,
    ReferenceArrayInput,
    ReferenceInput,
    SelectArrayInput,
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
                <SelectArrayInput
                    optionText={(record) => (
                        <img
                            src={record.src}
                            alt={record.altText}
                            style={{ width: '100px' }}
                        />
                    )}
                />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);
