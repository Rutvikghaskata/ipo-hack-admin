import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.scss";
import Logo from "../../../assets/images/admin-logo.svg";
import { IoNewspaperOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { createAction } from "../../../utils/common";
import * as actionTypes from "../../../redux/actionTypes";
import { IoIosLogOut } from "react-icons/io";
import { CiSettings } from "react-icons/ci";

function SideBar() {
  let location = useLocation();
  const CURRENT_WB_NAME = location.pathname.split("/")[1];
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(createAction(actionTypes.LOG_OUT_SUCCESS));
  };
  return (
    <aside className="sidebar-wrapper">
      <div className="logo-container">
        <img src={Logo} alt="logo" className="logo" />
        <p
          onClick={handleLogout}
          className="flex align-items--center justify-content--center mb--10 gap--10 pointer"
        >
          <IoIosLogOut style={{ fontSize: 25 }} />
          Logout
        </p>
      </div>
      <ul>
        <li className={CURRENT_WB_NAME === "news" && "active"}>
          <IoNewspaperOutline />
          <Link to={"./news"}>News</Link>
        </li>
        <li className={CURRENT_WB_NAME === "gmp" && "active"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M24 12.5C24 18.8513 18.8513 24 12.5 24C6.14873 24 1 18.8513 1 12.5C1 6.14873 6.14873 1 12.5 1C18.8513 1 24 6.14873 24 12.5Z"
              stroke="url(#paint0_linear_69_6)"
              stroke-width="2"
            />
            <path
              d="M7.3695 15.112C6.97517 15.112 6.62167 15.007 6.309 14.797C5.99867 14.587 5.7525 14.2977 5.5705 13.929C5.39083 13.558 5.301 13.1322 5.301 12.6515C5.301 12.2898 5.3535 11.9597 5.4585 11.661C5.56583 11.36 5.7175 11.101 5.9135 10.884C6.11183 10.6647 6.3475 10.4955 6.6205 10.3765C6.89583 10.2575 7.2015 10.198 7.5375 10.198C8.04617 10.198 8.46033 10.3135 8.78 10.5445C9.09967 10.7732 9.32717 11.1325 9.4625 11.6225L8.2725 11.836C8.19317 11.6423 8.08817 11.4895 7.9575 11.3775C7.82683 11.2655 7.66583 11.2095 7.4745 11.2095C7.2925 11.2095 7.128 11.2678 6.981 11.3845C6.83633 11.5012 6.722 11.6668 6.638 11.8815C6.554 12.0962 6.512 12.3528 6.512 12.6515C6.512 12.9478 6.554 13.2045 6.638 13.4215C6.722 13.6362 6.83633 13.8018 6.981 13.9185C7.128 14.0352 7.2925 14.0935 7.4745 14.0935C7.65417 14.0935 7.814 14.0562 7.954 13.9815C8.09633 13.9045 8.20717 13.8018 8.2865 13.6735C8.36817 13.5428 8.409 13.3993 8.409 13.243H8.605C8.605 13.6257 8.5595 13.957 8.4685 14.237C8.3775 14.517 8.241 14.7328 8.059 14.8845C7.877 15.0362 7.64717 15.112 7.3695 15.112ZM8.549 15L8.409 14.034V13.201L7.4745 13.194V12.508H9.473V15H8.549ZM10.5749 10.303H12.1779L13.2174 12.809H13.1299L14.1694 10.303H15.7094V15H14.5824V11.6575H14.7364L13.5289 14.5625H12.8044L11.6039 11.6645H11.6949V15H10.5749V10.303ZM16.8701 15V10.303H18.6726C19.214 10.303 19.6433 10.4337 19.9606 10.695C20.278 10.954 20.4366 11.3378 20.4366 11.8465C20.4366 12.3528 20.278 12.7378 19.9606 13.0015C19.6433 13.2628 19.214 13.3935 18.6726 13.3935H17.9971V15H16.8701ZM17.9971 12.4135H18.6726C18.8756 12.4135 19.0285 12.3575 19.1311 12.2455C19.2361 12.1312 19.2886 11.9982 19.2886 11.8465C19.2886 11.6925 19.2361 11.5583 19.1311 11.444C19.0285 11.3297 18.8756 11.2725 18.6726 11.2725H17.9971V12.4135Z"
              fill="url(#paint1_linear_69_6)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_69_6"
                x1="12.5"
                y1="0"
                x2="12.5"
                y2="25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#5A7CF1" />
                <stop offset="1" stop-color="#AE92FD" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_69_6"
                x1="12.8829"
                y1="9"
                x2="12.8829"
                y2="17.5586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#5A7CF1" />
                <stop offset="1" stop-color="#AE92FD" />
              </linearGradient>
            </defs>
          </svg>
          <Link to={"./gmp"}>GMP</Link>
        </li>
        <li className={CURRENT_WB_NAME === "settings" && "active"}>
          <CiSettings size={28}/>
          <Link to={"./settings"}>Settings</Link>
        </li>
      </ul>
    </aside>
  );
}

export default SideBar;
