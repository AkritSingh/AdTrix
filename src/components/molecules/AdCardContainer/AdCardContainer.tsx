import React, { memo } from 'react';
import './AdCardContainer.css';
import AdCard from '../../molecules/AdCard/AdCard';
import { adInfo, appliedFilterSetting } from "../../signals/signals"; // Import the original signal
import { useSignal } from "@preact/signals";
const AdCardContainer = memo(() => {

    const cardLoadingType = appliedFilterSetting.value.cardFilter.fields[1].selected;
    const cardType = appliedFilterSetting.value.cardFilter.fields[2]?.value || [];
    const adsSignal = useSignal(adInfo); // Use adInfo.ads directly with useSignal
    const {ads} = adInfo.value; // Access the value from the signal object

    let adsArray = ads;
    return (
        <div className={`AdCardContainer left  ${cardLoadingType}`}>
            {adsArray.length > 0 && adsArray.sort((a, b) =>  { 
                return a.positionTop - b.positionTop
            }).filter((item)=>{
                if(Array.isArray(cardType) && cardType.length  >  0){
                    return cardType.includes(item.attributes.type)
                }else{
                    return true
                }
            }).map((item, index) => (
                <AdCard key={index} indexNo={index+1} attributes={item.attributes} positionTop={item.positionTop} />
            ))}
            {adsArray.length === 0 && <div>No Amp Ads to display</div>
            }
        </div>
    );
});

export default AdCardContainer;