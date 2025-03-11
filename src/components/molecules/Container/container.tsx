import React, {useState, memo} from 'react';
import './container.scss';
import AdCardContainer from '../../molecules/AdCardContainer/AdCardContainer';
import InfoContainer from '../../molecules/InfoContainer/InfoContainer';
import Sqeeze from '../../svg/sqeeze';
import Expand from '../../svg/expand';
import Button from '../../atoms/Button/button';


const Container = memo(() => {
    const [expanded, setExpanded] = useState<boolean>(false);
    
    const expandBtnProps = {
        classname: 'btn primary iconOnly',
        onclick: ()=> expanded ? setExpanded(false) : setExpanded(true),
    }

    return (
        <div className={`Container ${expanded ? 'expand': ''}`}>
            <div className='toolbar'>                
                <Button {...expandBtnProps}>{expanded? <Sqeeze/> : <Expand/>}</Button>                
            </div>
            <AdCardContainer/>
            <InfoContainer/>
        </div>
    )
});

export default Container;