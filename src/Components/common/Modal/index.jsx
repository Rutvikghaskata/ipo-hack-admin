import React from "react";
import style from "./modal.module.scss";

const PopupOverlay = ({ children, isVisible, type }) => (
  <div
    className={`${style["modal-overlay"]} ${
      isVisible ? style["in-view"] : ""
    } ${style[`${type}`]}`}
  >
    {children}
  </div>
);
const PopupInner = ({ children }) => (
  <div className={style.modalInner}>{children}</div>
);
const PopupBody = ({ children }) => (
  <div className={style.modalBody}>{children}</div>
);
const PopupClose = (props) => (
  <div className={style["x-mark-wrapper"]} {...props}>
    <span className={style["x-mark"]}></span>
    <span className={style["x-mark"]}></span>
    <span className={style["mask"]}></span>
  </div>
);
const PopupTitle = ({ children }) => (
  <h2 className={style.title}>{children}</h2>
);
function Modal(props) {
  const { isVisible, title, onClose, children, type } = props;
  return (
    <PopupOverlay isVisible={isVisible} type={type}>
      <PopupInner>
        <PopupClose onClick={onClose} />
        <PopupBody>
          <PopupTitle>{title}</PopupTitle>
          {children}
        </PopupBody>
      </PopupInner>
    </PopupOverlay>
  );
}

export default Modal;
