import { RichTextInput } from 'ra-input-rich-text';
import {
    AutocompleteArrayInput,
    Create,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const ProjectCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="slug" />
            <RichTextInput source="description" className="rich-text" />
            <TextInput source="codeUrl" />
            <TextInput source="demoUrl" />
            <ReferenceArrayInput
                label="Images"
                reference="image"
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
            <ReferenceArrayInput
                label="Technologies"
                reference="technology"
                source="technologyIds"
            >
                <AutocompleteArrayInput optionText={'name'} />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
