import React , {memo, useState} from 'react';
import './InfoContainer.css';
import { activeTab } from '../../signals/signals';
import AttrTab from '../Tabs/AttrTab/AttrTab';
import NetTab from '../Tabs/NetTab/NetTab';
import InsightTab from '../Tabs/InsightTab/InsightTab';


const InfoContainer = () => {
    // const [activeTab, setActiveTab] = useState('Attributes');
    const handleClick = () =>{
        
    }
    const filterBtnProps = {
        tip: 'Filter',
        classname: 'white-c btn primary iconOnly',
        onclick: handleClick,
    }
    const reportBtnProps = {
        tip: 'Report',
        classname: 'white-c btn primary iconOnly',
        onclick: handleClick,
    }
    return (
        <div className='InfoContainer right'>
            <div className='info-toolbar'>
                <div className={`tab ${activeTab.value === 'Attributes' ? 'active' : ''}`} onClick={()=>activeTab.value = 'Attributes'}>Attributes</div>
                <div className={`tab ${activeTab.value === 'Network' ? 'active' : ''}`} onClick={()=>activeTab.value = 'Network'}>Network</div>
                <div className={`tab ${activeTab.value === 'Insights' ? 'active' : ''}`} onClick={()=>activeTab.value = 'Insights'}>Insights</div>
            </div>
            <div className='tabContent'>
                {activeTab.value === 'Attributes' && <AttrTab/>}
                {activeTab.value === 'Network' && <NetTab/>}
                {activeTab.value === 'Insights' && <InsightTab/>}
            </div>
        </div>
    )
};

export default InfoContainer;