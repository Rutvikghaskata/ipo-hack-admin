import * as actionTypes from "./actionTypes";

import AuthService from "../services/auth.service";

const INITIAL_STATE = {
  isLoading: false,
  isLogin: AuthService.checkLogin(),
  adminData: {},
};

const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.FINISH_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLogin: true,
      };
    case actionTypes.LOG_OUT_SUCCESS:
      AuthService.removeAuthData();
      return {
        ...state,
        isLogin: false,
      };
    case actionTypes.SET_ADMIN_DATA:
      return {
        ...state,
        adminData: action.payload,
      };
    case actionTypes.REMOVE_ADMIN_DATA:
      return {
        ...state,
        adminData: {},
      };
    default:
      return state;
  }
};

export default reducer;
