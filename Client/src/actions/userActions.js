import { IS_LOGIN, USER_NAME, USER_PASSWORD } from "./types";
import { pageLoading, alertError, alertSuccess } from "./alertActions";
import User from "../services/userService";


export const userNameChange = username => {
  const type = USER_NAME;
  return { type, username };
};
export const userPasswordChange = password => {
  const type = USER_PASSWORD;
  return { type, password };
};
export const userLogin = (token, username) => {
  const type = IS_LOGIN;
  User.setToken(token);
  User.setUserInfo(username);
  console.log(token);
  return { type, token };
};

export const userClear = () => {
  const type = IS_LOGIN;
  User.clearData();
  return { type, token: null };
};

export const userLoginSubmit = (username, password) => {
    console.log(username, password);
  return dispatch => {
    dispatch(pageLoading());
    if (User.loginAttempt(username, password)) {
      dispatch(userLogin(Math.random(), username));
      return dispatch(
        alertSuccess("Sign-in successful! Redirecting...")
      );
    }
    return dispatch(alertError("Username or Password are incorrect"));
  };
};

export const userLogout = () => {
  return dispatch => {
    /*dispatch(userPassword("1"));*/
    dispatch(alertSuccess("Session was successfully closed"));
    dispatch(userClear());
  };
};
