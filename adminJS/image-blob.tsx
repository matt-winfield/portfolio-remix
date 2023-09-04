import { type BasePropertyProps } from 'adminjs';

const ImageBlob = (props: BasePropertyProps) => {
    const { record, property } = props;

    if (!record) {
        return null;
    }

    const value = record.params[property.name];
    const imageType = (record.params.contentType as string) ?? 'image/png';
    const data = new Uint8Array(value.data);

    const blob = new Blob([data.buffer], { type: imageType });

    const src = URL.createObjectURL(blob);

    return <img src={src} alt="" style={{ width: 200, height: 200 }} />;
};

export default ImageBlob;
