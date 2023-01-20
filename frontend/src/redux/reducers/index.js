import { combineReducers } from '@reduxjs/toolkit';

import { userReducer } from './userReducer';
import { deleteThis } from './delete';

export default combineReducers({ userReducer, deleteThis });
