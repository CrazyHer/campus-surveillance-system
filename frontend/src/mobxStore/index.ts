import { configure } from 'mobx';
import Counter from './counter';
import MapConfig from './mapConfig';
import User from './user';

configure({ enforceActions: 'observed' });

const user = new User();
const counter = new Counter();
const mapConfig = new MapConfig();

export default { user, counter, mapConfig };
