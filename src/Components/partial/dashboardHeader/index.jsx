import React, { useEffect } from "react";
import style from "./dashobardHeader.module.scss";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../../redux/actionTypes";
import { createAction } from "../../../utils/common";
import { IoNotifications } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { notifications } from "../../../constants/constant";
import { CiSettings, CiUser } from "react-icons/ci";
import UserImage from "../../../assets/images/user.png";

function DashboardHeader({ handleModal, profile }) {
  const notificationRef = React.useRef();
  const userRef = React.useRef();
  const [isNotiMenu, setIsNotiMenu] = React.useState(false);
  const [isUserMenu, setIsUserMenu] = React.useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(createAction(actionTypes.LOG_OUT_SUCCESS));
  };

  const toggleNotiMenu = () => {
    setIsNotiMenu(!isNotiMenu);
  };
  const toggleUserMenu = () => {
    setIsUserMenu(!isUserMenu);
  };

  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef?.current.contains(event.target)
    ) {
      setIsNotiMenu(false);
    }
    if (userRef.current && !userRef?.current.contains(event.target)) {
      setIsUserMenu(false);
    }
  };
  useEffect(() => document.addEventListener("click", handleClickOutside), []);
  return (
    <div className={style.header}>
      <h1>Main Dashboard</h1>
      <div className={style.profile}>
        <div ref={notificationRef}>
          <IoNotifications
            className={style.notification}
            onClick={toggleNotiMenu}
          />
          <span className={style.notiCount}>{7}</span>
          <div
            className={`${style["dropdown-menu"]} ${
              isNotiMenu && style["active"]
            }`}
          >
            <p>NOTIFICATION</p>
            <ul>
              {notifications.map((data) => (
                <li
                  className={!data.seen && style.unseen}
                  onClick={() => {
                    handleModal(data);
                  }}
                >
                  <h4>{data.title}</h4>
                  <span>{data.desc}</span>
                  <div>
                    <span>{data.date}</span>
                    <span>{data.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div ref={userRef}>
          <button className={style.avatar} onClick={toggleUserMenu}>
            <img src={UserImage} alt="" />
          </button>
          <div
            className={`${style["dropdown-menu"]} ${style["user"]} ${
              isUserMenu && style["active"]
            }`}
          >
            <p>👋 Hey, Admin</p>
            <li>
              <CiUser />
              Profile
            </li>
            <li>
              <CiSettings />
              Setting
            </li>
            <li onClick={handleLogout}>
              <IoIosLogOut />
              Logout
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
