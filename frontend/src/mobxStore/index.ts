import { configure } from 'mobx';
import MapConfig from './mapConfig';
import User from './user';

configure({ enforceActions: 'observed' });

const user = new User();
const mapConfig = new MapConfig();

export default { user, mapConfig };
