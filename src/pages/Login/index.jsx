import React, { useState, useCallback } from "react";
import "react-activity/dist/library.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import style from "./login.module.scss";
import AuthService from "../../services/auth.service";
import { createAction } from "../../utils/common";
import WebWhiteLogo from "../../assets/images/admin-logo.svg";
import * as actionTypes from "../../redux/actionTypes";
import InputField from "../../Components/common/InputField";
import Button from "../../Components/common/Button";
import { errorReg, passwordReg } from "../../utils/regex";
import CheckBox from "../../Components/common/Checkbox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [state, setState] = useState({
    email: localStorage.getItem("admin-email") || "",
    password: localStorage.getItem("admin-password") || "",
    emailError: "",
    passwordError: "",
    rememberMe: false,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "email") {
      setState((prev) => ({
        ...prev,
        emailError: !value.trim()
          ? "Email is required"
          : !value.match(errorReg)
          ? "Please enter valid email"
          : "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        passwordError: !value.trim()
          ? "Password is required"
          : !value.match(passwordReg)
          ? "Please enter valid password"
          : "",
      }));
    }
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      !state.email.trim() ||
      !state.password.trim() ||
      !state.email.match(errorReg) ||
      !state.password.match(passwordReg)
    ) {
      setState((prev) => ({
        ...prev,
        emailError: !state.email.trim()
          ? "Email is required"
          : !state.email.match(errorReg)
          ? "Please enter valid email"
          : "",
        passwordError: !state.password.trim()
          ? "Password is required"
          : !state.password.match(passwordReg)
          ? "Please enter valid password"
          : "",
      }));
      return;
    }
    setLoading(true);
    const data = { email: state.email, password: state.password };
    sendLoginDetails(data, state.rememberMe);
  };

  const sendLoginDetails = useCallback(
    async (data, isRemember) => {
      try {
        const { email, password } = data;
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            isRemember &&
              AuthService.setRememberPassword(data.email, data.password);
            dispatch(createAction(actionTypes.LOGIN_SUCCESS));
            AuthService.setAuthData(user.accessToken);
            toast.success("🎉 Login Successful.");
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.message);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data);
      }
    },
    [dispatch]
  );

  return (
    <div className={style.login}>
      <div className={style["container"]}>
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <InputField
            label="Email"
            name="email"
            value={state.email}
            type="text"
            placeholder="Enter Email"
            onChange={handleOnChange}
            error={state.emailError}
          />
          <InputField
            label="Password"
            name="password"
            value={state.password}
            type="password"
            placeholder="Enter Password"
            onChange={handleOnChange}
            error={state.passwordError}
          />
          <CheckBox
            checked={state.rememberMe}
            onChange={(checked) =>
              setState((prev) => ({
                ...prev,
                rememberMe: checked,
              }))
            }
          >
            Remember password
          </CheckBox>
          <Button type="submit" className="full-width" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
