import React, {memo, useEffect} from 'react';
import './NetTab.css';
import { networkTabData, appliedFilterSetting } from '../../../signals/signals';
import DynamicTable from '../../../molecules/DynamicTable/DynamicTable';
import NetCard from './NetCard';

const NetTab = memo(() => {
    const {data} = networkTabData.value;
    const fields = appliedFilterSetting.value.networkFilter.fields[0].value;
    let finalData = data;

    if(fields && Array.isArray(fields) && fields.length > 0){
        const updatedData = data?.filter((item)=>  fields.includes(item.hostname));
        finalData = updatedData
    }
    
    return (
        <>
            {finalData && Array.isArray(finalData) ? 
            <div className={`netTab`}>
                <div className='netTabcontainer'>
                   {
                    [...finalData]
                    .sort((a, b) => (a.request?.requestTime || 0) - (b.request?.requestTime || 0))
                    .map((item, index) =>
                        <NetCard key={index} item={item} index={index}/>
                    )
                   } 
                </div>
            </div>   
            : <div className='col-2 secondary-c font-30 font-bold j-center box-100'>No Data to Preview</div>}
        </>
        
    )
});

export default NetTab;