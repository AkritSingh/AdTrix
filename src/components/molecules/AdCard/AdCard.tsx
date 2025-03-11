import React, { useEffect, memo, useState } from 'react';
import './AdCard.css';
import Button from '../../atoms/Button/button';
import Inspect from '../../svg/inspect';
import { activeCardIndex, attributeTabData, networkTabData, insightsTabData, adInfo } from "../../signals/signals";
import {getAdNetworkData, scrollIntoView} from '../../utils/utils';
// import { usePageContext } from '../../contexts/PageContext';

interface PerfNetworkData { 
    data?: Record<string, any>;
    empty: boolean;
}
interface PerfData { 
    request?: Record<string, any>;
    response?: Record<string, any>;
}

interface AdCardProps {
    indexNo: number;
    attributes: any;
    positionTop: any;
    perfData?: PerfData;
}


const AdCard: React.FC<AdCardProps> = memo(({
    attributes, positionTop, indexNo
}) => {
    const [perfNetwork, setPerfNetwork] = useState<PerfNetworkData>({empty: true});
    const [perfData, setperfData] = useState<PerfData>({});
    const [fetchCount, setFetchCount] = useState<number>(0);
    const [networkFetched, setNetworkFetched] = useState(false);
    const [allNetworks, setAllNetworks] = useState([]);
    const adtrixId = attributes['data-adtrix_id'] || `adtrix_${indexNo-1}`;
    
    const slot = attributes['data-slot'] || attributes['data-clmb_slot'] || attributes['type'] || attributes['data-placement'] || '';
    const type = attributes['type'] || '';
    
    const getSlotSplit = (slot) => {
        const slotArr = slot.split('/');
        
        const primarySlot = slotArr.length > 1 ? slotArr.slice(0,slotArr.length-1).join('/') : '';
        const secondarySlot = slotArr[slotArr.length-1];
        return {
            primarySlot,
            secondarySlot
        };
    }
    const {primarySlot, secondarySlot} = getSlotSplit(slot);

    function checkNetworkData(): void {
        setFetchCount((e)=>e+1);
        
    }
    useEffect(()=>{
        checkNetworkData();
    },[])

    useEffect(()=>{
        getAdNetworkData(secondarySlot, setPerfNetwork, fetchCount, undefined);
        
    },[fetchCount])
    
    useEffect(() => {
        if (perfNetwork?.data) {
            const data = perfNetwork.data;
            setperfData(data);
    
            // Define condition
            const condition =
                data.response &&
                typeof data.response === "object" &&
                Object.keys(data.response).length > 0;
    
            // if(!condition){
            //     setTimeout(() => {
            //         console.log("Retrying network fetch...");
            //         checkNetworkData();
            //         console.log('loading')
            //     }, 7000);
            // }
            setNetworkFetched(condition);
        }else{
            // setTimeout(() => {
            //     console.log("Retrying network fetch...");
            //     checkNetworkData();
            //     console.log('loading')
            // }, 7000);
        }
    }, [perfNetwork]);  
    
    useEffect(()=>{
        networkTabData.value = allNetworks;
    },[allNetworks])

    const startTime: number = perfData?.request?.requestTime ? parseFloat((perfData?.request?.requestTime / 1000).toFixed(3)) : 0;
    const endTime: number = perfData?.response?.responseTime ? parseFloat((perfData?.response?.responseTime / 1000).toFixed(3)) : 0;
    const duration = endTime && startTime ? (endTime - startTime).toFixed(3) : 0;
    const reqUserPos: number = perfData?.request?.scrollPosition?.viewport || 0;

    // if(window){
    //     window.networkTabData  =  
    // }
    

    const insightDataReady = () =>{
        var insightData = {
            vpDiff: 'not loaded yet',
            lazyload: 'Off',
            refresh: 'Off',
            errors:[]
        }

        if(positionTop && reqUserPos){
            insightData.vpDiff = `${Math.abs(reqUserPos - positionTop).toFixed(3)}`;
        }
        if(attributes['data-loading-strategy']){
            insightData.lazyload = attributes['data-loading-strategy'];
            if(attributes['data-lazy-fetch'] != 'true'){
                insightData.errors.push('lazyload not work without data-lazy-fetch attribute');
            }
        }
        if(attributes['data-enable-refresh']){
            insightData.refresh = attributes['data-enable-refresh'];
        }
        return {...insightData};
    }
    adInfo.value.ads[indexNo-1].network =  {
        startTime,
        endTime,
        duration,
        reqUserPos,
        ...insightDataReady()
    };
    const handleClick = ()=>{
        getAdNetworkData(secondarySlot, setAllNetworks, fetchCount, 'transferAllNetwork');
        activeCardIndex.value =  indexNo;
        attributeTabData.value = {...attributes, indexNo};
        insightsTabData.value = insightDataReady();
    }
    
    // console.log(props);
    const inspectBtnProps = {
        classname: 'index btn iconOnly font-10 inspect',
        onclick: ()=> scrollIntoView(adtrixId),
    }
    const moreBtnProps = {
        classname: 'btn primary font-10 moreBtn white-c',
        onclick: handleClick,
    }
    
    return (
        <div className={`AdCard ${networkFetched ? 'done' : ''} ${activeCardIndex.value === indexNo ?  'active' : ''}`}>
            <div className='index font-10'>{indexNo}</div>
            <Button {...inspectBtnProps}><Inspect/></Button>
            <div className='font-10 placeholder ml-30 secondary-c'>{type}</div>
            
            <div className='content'>
                {primarySlot && <div className='secondary-c font-12'>{primarySlot}</div>}
                {secondarySlot && <div className='font-12 font-bold'>{secondarySlot}</div>}

                <div className='font-10 placeholder mt-10'>
                    <span className='secondary-c'>View port: load at: </span>
                    <span className='font-bold'>{reqUserPos  ? reqUserPos: '----'}</span>
                    <span className='secondary-c'> ad pos: </span>
                    <span className='font-bold'>{positionTop  ? positionTop: '----'}</span>
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

export default AdCard;