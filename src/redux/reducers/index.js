import { combineReducers } from 'redux';
import Groups from './Groups';
import currentGroup from './currentGroup';


export default combineReducers({
    Groups,
    currentGroup
});
