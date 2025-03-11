import React, { useState, useEffect, useRef } from 'react';
import Cross from '../../svg/cross';
import Print from '../../svg/print';
import Button from '../../atoms/Button/button';
import './PopUp.css';

function PopUp({
    id,
    index,
    handleClose,
    Component
}) {
    const closeBtnProps = {
        tip: 'Close PopUp',
        classname: 'crossBtn btn iconOnly',
        onclick: handleClose,
        tipDir: 'left'
    }
    const printBtnProps = {
        tip: 'Print',
        classname: 'printBtn btn primary iconOnly',
        onclick: handleClose,
    }
    return (
        <div
          key={id}
          className="popUp"
          style={{ zIndex: 2 + index }} // Manage stacking order
        >
          <div className="relative bg-white p-5 rounded-lg shadow-lg">
            <Button {...closeBtnProps}><Cross/></Button>
            {/* <Button {...printBtnProps}><Print/></Button> */}
            <div className="childWrapper"><Component /></div>
          </div>
        </div>
  )
}

export default PopUp