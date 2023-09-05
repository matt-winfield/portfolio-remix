import { Admin, EditGuesser, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from '../providers/data-provider.tsx';
import { NoteImageEdit } from './resources/note-image/note-image-edit.tsx';
import { NoteImageList } from './resources/note-image/note-image-list.tsx';
import { NoteImageShow } from './resources/note-image/note-image-show.tsx';
import { NoteList } from './resources/note/note-list.tsx';
import { PermissionList } from './resources/permission/permission-list.tsx';
import { RoleList } from './resources/role/role-list.tsx';
import { UserList } from './resources/user/user-list.tsx';

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
            edit={NoteImageEdit}
        />
    </Admin>
);

export default App;
