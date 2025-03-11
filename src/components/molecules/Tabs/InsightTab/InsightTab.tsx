import React, {memo} from 'react';
import './InsightTab.css';
import {insightsTabData} from '../../../signals/signals';
// import Button from '../../atoms/Button/button';


const InsightTab = memo(() => {
    const {vpDiff, lazyload, refresh, errors} = insightsTabData.value;
    return (
        <div className={`insightTab box-100`}>
            <div className='font-20 font-bold green-c mt-10'>
                Info
            </div>
            <div className='col-2 mb-5'>
                <div className='secondary-c  font-17'>viewport difference:</div>
                <div className='black-c  font-17 font-bold'>{vpDiff}</div>
            </div>
            <div className='col-2 mb-5'>
                <div className='secondary-c  font-17'>lazyload</div>
                <div className='black-c  font-17 font-bold'>{lazyload}</div>
            </div>
            <div className='col-2 mb-10'>
                <div className='secondary-c  font-17'>refresh</div>
                <div className='black-c  font-17 font-bold'>{refresh}</div>
            </div>
           
           {errors && Array.isArray(errors) && errors.length > 0 && (
               <>
               <div className='font-20 font-bold red-c mt-20'>Errors</div>
                <ul className='mt-10'>
                    {errors.map((err, index) => <li key={index}  className='font-15 secondary-c mb-5'>{err}</li>)}
                </ul>
               </>
           )}
            
        </div>
    )
});

export default InsightTab;