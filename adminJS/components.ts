import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';

const componentLoader = new ComponentLoader();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Components = {
    ImageBlob: componentLoader.add('ImageBlob', path.join(__dirname, 'image-blob.tsx')),
}

export { Components, componentLoader };
