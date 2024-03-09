import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./routes.scss";
import Loader from "../Components/Loader";
import { Login, News, GMP } from "../pages";
import SideBar from "../Components/layout/Sidebar";
import HttpService from "../services/http.service";
import { API_CONFIG } from "../constants/constant";
import { createAction } from "../utils/common";
import * as actionTypes from "../redux/actionTypes";

const allowSideBarPaths = ["news", "gmp", ""];

function RoutesScreen() {
  let location = useLocation();
  const CURRENT_WB_NAME = location.pathname.split("/")[1];
  const visibleSidebar = allowSideBarPaths.includes(CURRENT_WB_NAME);
  const { isLoading, isLogin } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getAdminInfo = useCallback(async () => {
    try {
      const response = await HttpService.get(`${API_CONFIG.path.profile}`);
      const result = response.data;
      dispatch(createAction(actionTypes.SET_ADMIN_DATA, result));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    isLogin && getAdminInfo();

    return () => {};
  }, [getAdminInfo, isLogin]);
  return (
    <div className="routes-wrapper">
      <Loader active={isLoading} />
      <div className="routes-container">
        <>
          {visibleSidebar && (
            <div className="sidebar">
              <SideBar />
            </div>
          )}
          <div
            className={
              visibleSidebar ? "main-content" : "main-content none-sidebar"
            }
          >
            <div className="main-screens">
              {isLogin && (
                <Routes>
                  <Route expect path="news" element={<News />} />
                  <Route expect path="gmp" element={<GMP />} />
                  <Route path="*" element={<Navigate to="/news" />} />
                </Routes>
              )}
              {!isLogin && (
                <Routes>
                  <Route expect path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default RoutesScreen;
