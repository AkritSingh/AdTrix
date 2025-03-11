import React, { useEffect, memo } from "react";
import PopUp from '../../atoms/PopUp/PopUp';
import './PopUpWrapper.css';
import {popUpQue} from "../../signals/signals";


interface PopupData {
  id: string;
  Component: React.FC;
}

const PopUpWrapper: React.FC = memo(() => {

  const closePopup = (id: string) => {
    popUpQue.value = popUpQue.value.filter((popup) => popup.id !== id);
  };

  if (popUpQue.value.length === 0) return null; // Hide if no popups

  return (
    <div className="popUpWrapper">
      <div className="blurLayer"/>
      {popUpQue.value.map((popup, index) => (
        <PopUp id={popup.id} index={index} Component ={popup.Component} handleClose= {()=>closePopup(popup.id)}/>
      ))}
    </div>
  );
});

export default PopUpWrapper;
