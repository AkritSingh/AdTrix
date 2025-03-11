import React, { memo, useState } from "react";
import './GenarateReport.css';
import { adInfo, adAllAttr, pageURL,  appliedFilterSetting } from "../../signals/signals";
import NetworkTable from "./networkTable";

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


//   useEffect(()=>{
//     console.log(allNetworks.value);
//     setAllNetworkData(allNetworks.value);
//   },[dataReady])

  return (
    <div className="report">
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

                    {selectedFields.map((item, index)=>
                        <th key={`attr_${index}`}>{item}</th>
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
