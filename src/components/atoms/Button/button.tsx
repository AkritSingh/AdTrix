import React, { useState } from 'react';
import './button.css';
import Tooltip from '../../svg/tooltip'

const Button = (props) => {
    const{
        tip, 
        children, 
        classname, 
        onclick, 
        tipDir = 'right'
    } = props || {}

    
    const handleClick = (e) =>{
        e.preventDefault();
        if(onclick && typeof onclick === 'function'){
            onclick();
        }
    }
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button onClick={handleClick} type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={classname}>{children}
            {tip && <span className={`tooltip ${tipDir} ${isHovered ? 'show': ''}`}>
            <Tooltip/>{tip}</span>}
        </button>
    )
};

export default Button;