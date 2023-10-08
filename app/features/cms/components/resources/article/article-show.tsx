import {
    BooleanField,
    ImageField,
    ReferenceArrayField,
    RichTextField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const ArticleShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="slug" />
            <BooleanField source="draft" />
            <TextField source="description" />
            <TextField source="tags" />
            <RichTextField source="content" className="rich-text" />
            <ReferenceArrayField
                label="Images"
                reference="image"
                source="imageIds"
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);
