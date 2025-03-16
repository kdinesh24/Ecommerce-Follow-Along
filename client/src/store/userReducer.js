import { SET_EMAIL } from './userActions';

const initialState = {
  email: ''
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;