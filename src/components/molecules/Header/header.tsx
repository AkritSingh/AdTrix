import React, {memo} from 'react';
import './header.css';
import Button from '../../atoms/Button/button';
import Fetch from '../../svg/fetch';
import Setting from '../../svg/setting';
import Report from '../../svg/report';
import GenarateReport from '../Report/GenarateReport';
import MainSettings from '../Settings/mainSettings';
import {showPopup, pageRefresh} from "../../utils/utils";
// import { attributeFilter, globalFilterDefault } from '../../signals/signals';

const Header = memo(() => {
    const handleClick = () =>{
        showPopup(() => <GenarateReport/>);
    }

    
    const handleSettingClick = () =>{
        showPopup(() => <MainSettings/>);
    }
    
    const fetchBtnProps = {
        tip: 'Refresh',
        classname: 'white-c btn primary iconOnly',
        onclick: pageRefresh,
    }
    const settingBtnProps = {
        tip: 'Settings',
        classname: 'white-c btn primary iconOnly',
        onclick: handleSettingClick,
    }
   
    const reportBtnProps = {
        tip: 'Report',
        classname: 'white-c btn primary iconOnly',
        onclick: handleClick,
    }

    return (
        <div className="header">
            <div className="logo">
                <img src="https://static.toiimg.com/photo/117742303.cms"/>
                <div className="font-15 mr-10 font-bold">AdTrix</div>
                <div className="font-15 water-blue-c font-bold">(Amp Ad)</div>
            </div>
            <div className='toolbar'>
                <Button {...reportBtnProps}><Report/></Button>
                <Button {...fetchBtnProps}><Fetch/></Button>
                <Button {...settingBtnProps}><Setting/></Button>
            </div>
            
        </div>
    )
});

export default Header;