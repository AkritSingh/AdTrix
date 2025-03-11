import React, {memo} from 'react';
import Button from '../../../atoms/Button/button';
import {showPopup} from '../../../utils/utils';
import DynamicTable from '../../../molecules/DynamicTable/DynamicTable';

interface NetCardProps {
    item: any;
    index: number;
}

const NetCard = memo(({ item, index }: NetCardProps) => {
    const handleClick = ()=>{
        showPopup(() => item && <DynamicTable data = {{...item}} />);
    }

    const moreBtnProps = {
        classname: 'btn primary font-10 moreBtn white-c',
        onclick: handleClick,
    }

    const {
        hostname, url, request, response
    } = item;



    const startTime: number = request?.requestTime ? parseFloat((request?.requestTime / 1000).toFixed(3)) : 0;
    const endTime: number = response?.responseTime ? parseFloat((response?.responseTime / 1000).toFixed(3)) : 0;
    const duration = endTime && startTime ? (endTime - startTime).toFixed(3) : 0;
    const reqUserPos: number = request?.scrollPosition?.viewport || 0;

    return (
        <div className={`AdCard netCard`}>
            <div className='index font-10'>{index + 1}</div>
            <div  className='content  mt-20'>
                <div className='font-12 black-c font-bold'>{hostname}</div>

                <div className='font-10 placeholder mt-10'>
                    <span className='secondary-c'>loaded at: </span>
                    <span className='font-bold'>{reqUserPos ? reqUserPos + 'vp' : '----'}</span>
                </div>

                <div className='font-10 placeholder mt-10'>
                    <span className='secondary-c'>status: </span>
                    <span className='font-bold'>{response?.status ? response?.status : '----'}</span>
                </div>

                <div className='col-2 mt-10'>
                    <div className='col'>
                        <div className='font-10 secondary-c'>Start Time</div>
                        <div className='font-12 font-bold green-c'>{startTime ? startTime + 's' : '---'}</div>
                    </div>
                    <div className='col'>
                        <div className='font-10 secondary-c'>End Time</div>
                        <div className='font-12 font-bold orange-c'>{endTime ? endTime + 's' : '---'}</div>
                    </div>
                </div>
                <div className='col mt-10'>
                    <div className='font-10 secondary-c'>Duration</div>
                    <div className='font-12 font-bold'>{duration ? duration + 's' : '---'}</div>
                </div>
                <Button {...moreBtnProps}>More</Button>
           </div>
        </div>
    )
});

export default NetCard;