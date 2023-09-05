import { Admin, EditGuesser, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from '../providers/data-provider.tsx';
import { NoteList } from './note-list.tsx';
import { PermissionList } from './permission-list.tsx';
import { NoteimageEdit } from './resources/note-image/note-image-edit.tsx';
import { NoteImageList } from './resources/note-image/note-image-list.tsx';
import { NoteImageShow } from './resources/note-image/note-image-show.tsx';
import { RoleList } from './role-list.tsx';
import { UserList } from './user-list.tsx';

const App = () => (
    <Admin basename="/admin/cms" dataProvider={dataProvider('/api')}>
        <Resource
            name="User"
            list={UserList}
            show={ShowGuesser}
            edit={EditGuesser}
        />
        <Resource
            name="Note"
            list={NoteList}
            show={ShowGuesser}
            edit={EditGuesser}
        />
        <Resource
            name="Role"
            list={RoleList}
            show={ShowGuesser}
            edit={EditGuesser}
        />
        <Resource
            name="Permission"
            list={PermissionList}
            show={ShowGuesser}
            edit={EditGuesser}
        />
        <Resource
            name="NoteImage"
            list={NoteImageList}
            show={NoteImageShow}
            edit={NoteimageEdit}
        />
    </Admin>
);

export default App;
