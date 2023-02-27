import { configure } from 'mobx';
import Counter from './counter';
import User from './user';

configure({ enforceActions: 'observed' });

const user = new User();
const counter = new Counter();

export default { user, counter };
