import React from 'react';
import './customPrompt.css';
import Button from '../Button/button';
import {promtData} from '../../signals/signals';

interface CustomPromptProps {
    msg: string | React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string,
    cancelText: string,
}

interface PromptData {
    show: boolean;
    data: any; 
}

const CustomPrompt = () => {
    const {show, data} = promtData.value as PromptData;
    const {msg, onConfirm, onCancel, confirmText, cancelText} = data as CustomPromptProps;
    const onClickBtn = (func) => {
        promtData.value = {show: false};
        if(func && typeof func === 'function'){
            func();
        }
    }
    const yesBtnProps = {
        classname: 'white-c btn primary apply font-12',
        onclick: () => onClickBtn(onConfirm),
        tipDir: 'top-right'
    }
    
    const cancelBtnProps = {
      classname: 'white-c btn light-red delete font-12 mr-10',
      onclick: ()=>onClickBtn(onCancel),
      tipDir: 'top-left'
    }
    return show && 
      <div className="customPrompt">
        <div className='wrapper'>
            <p className="font-12 mb-10">{msg}</p>
            <div className="btnWrapper">
                {onCancel && typeof onCancel === 'function' && <Button {...cancelBtnProps}>{cancelText || 'Cancel'}</Button>}
                {onConfirm && typeof onConfirm === 'function' && <Button {...yesBtnProps}>{confirmText || 'Ok'}</Button>}
            </div>
        </div>
      </div>;
};

export default CustomPrompt