import React, { memo, useState } from "react";
import './GenarateReport.css';
import { adInfo, adAllAttr, pageURL,  appliedFilterSetting, appliedFilter, comparedData, adAllAttrOriginal } from "../../signals/signals";
import NetworkTable from "./networkTable";
// import Button from '../../atoms/Button/button';
import { showPromt, setData,  getData} from "../../utils/utils";

const GenarateReport: React.FC = memo(() => {
  const {ads} = adInfo.value;

  const [dataReady, setDataReady] = useState(true);
  
  const fields = appliedFilterSetting.value.attributeFilter.fields[0].value;
  
    var selectedFields = adAllAttr.value;
    if(fields && Array.isArray(fields) && fields.length > 0){
        selectedFields = fields;
    }


  const fetchNetworkData = (ad, index) => {

    var slot = ad.attributes['data-slot'] || ad.attributes['data-clmb_slot'] || ad.attributes['data-placement'] || '';
    var slot = slot.split('/');
    slot = slot[slot.length - 1];

    return  <NetworkTable  slot={slot} index={index}/>    
  }

const compareReport = () => {
    const isComparing = Array.isArray(comparedData.value) && comparedData.value.length > 0 && comparedData.value.length <  100
    if(appliedFilter.value == 'default'){
        showPromt(isComparing  ? `Are you sure you want to compare with previous report?` : `Are you sure you want to start compare report?`,()=>{
            try {
                if(isComparing){
                    getData('comparedData',(response)=>{
                        comparedData.value = response?.data?.comparedData || [];
                        adAllAttr.value.forEach((item)=>{
                            if(!comparedData.value.includes(item)){
                                comparedData.value.push(item);
                            }
                        })
                        adAllAttr.value  = comparedData.value;
                        selectedFields =  comparedData.value;
                        function confitmFunc(response){}
                        setData('comparedData', {comparedData: comparedData.value}, confitmFunc);
                    });  
                }else{ 
                    adAllAttr.value.forEach((item)=>{
                        if(!comparedData.value.includes(item)){
                            comparedData.value.push(item);
                        }
                    })
                    adAllAttr.value  = comparedData.value;
                    selectedFields =  comparedData.value;
                    function confitmFunc(response){}
                    setData('comparedData', {comparedData: comparedData.value}, confitmFunc);
                }
            } catch (e) {
                console.log(e);
            }
          }, ()=>{});
    }else{
        showPromt(`Applied Filter should be 'Default' for this operation. Want to apply 'Default' filter?`,()=>{
            try {
                appliedFilter.value = 'default';
                setData('appliedFilter',{appliedFilter: appliedFilter.value}, (response)=>{
                  if(response){
                    console.log('saved');
                    compareReport();
                  }
                })
            } catch (e) {
                console.log(e);
            }
          }, ()=>{});
    }
}

const clearCompare  = ()  =>{
    const isComparing = Array.isArray(comparedData.value) && comparedData.value.length > 0 && comparedData.value.length <  100
    showPromt(isComparing  ? `Are you sure you want to reset comparision?` : `No comparision saved.`,()=>{
        try {
            if(isComparing){
                function confitmFunc(response){}
                setData('comparedData', {comparedData: []}, confitmFunc);
            }
        } catch (e) {
            console.log(e);
        }
      }, ()=>{});
}

const compareReportBtnProps = {
    classname: 'white-c btn primary',
    onclick: compareReport,
}
const resetReportBtnProps = {
    classname: 'white-c btn light-red',
    onclick: clearCompare,
}
  return (
    <div className="report">
        <div className="col-2 mb-10 mt-10 report-btns">
            {/* <Button {...resetReportBtnProps}>Reset Comparision</Button>
            <Button {...compareReportBtnProps}>{Array.isArray(comparedData.value) && comparedData.value.length > 0 && comparedData.value.length <  100  ? 'Arrange Report For Comparision' : 'Start Fresh Comparision'}</Button> */}
        </div>
     <table cellSpacing="0" cellPadding="5">
        <tr><td>URL: </td><td>{pageURL.value}</td></tr>
     </table>
     {dataReady && 
        <table cellSpacing="0" cellPadding="5">
            <thead>
                <tr>
                    <th rowSpan={2}>SL. No.</th>
                    <th rowSpan={2}>AdCode</th>
                    <th colSpan={4}>Networks</th>
                    <th colSpan={4}>Insights</th>
                    <th colSpan={selectedFields.length}>Attributes</th>
                </tr>
                <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Request User Position</th>
                    
                    <th>PositionTop</th>
                    <th>Lazy-load</th>
                    <th>Refresh</th>
                    <th>Load difference</th>

                    {selectedFields.map((item, index)=>{
                        if(!adAllAttrOriginal.value.includes(item)){
                            return <th key={`attr_${index}`} style={{background: '#ee4848', color: 'white'}}>{item}</th>
                        }
                        return <th key={`attr_${index}`}>{item}</th>
                    }
                        
                    )}
                    
                </tr>
            </thead>
            <tbody>
                {
                    ads.map((ad, index)=>
                        <tr key={`ad_${index}`}>
                            <td>{index+1}</td>
                            <td>{ad.attributes['data-slot'] || ad.attributes['data-clmb_slot'] || ad.attributes['data-placement'] || '-'}</td>
                            
                            {fetchNetworkData(ad, index)}

                            <td>{ad.positionTop  || '-'}</td>
                            <td>{ad.network?.lazyload || '-'}</td>
                            <td>{ad.network?.refresh || '-'}</td>
                            <td>{ad.network?.vpDiff  || '-'}</td>

                            {selectedFields.map((item, index)=>
                                <td key={`attr_${index}`}>{ad.attributes[item] || '-'}</td>
                            )}
                        </tr>
                    )
                    
                }
                <tr><td>END</td></tr>
            </tbody>
        </table>
}
    </div>
    
  );
});

export default GenarateReport;
