import React, {memo} from 'react';
import './AttrTab.css';
import { attributeTabData,  appliedFilterSetting } from '../../../signals/signals';
import DynamicTable from '../../../molecules/DynamicTable/DynamicTable';

const AttrTab = memo(() => {
    const fields = appliedFilterSetting.value.attributeFilter.fields[0].value;
    var selectedFields = attributeTabData.value;
    if(fields && Array.isArray(fields) && fields.length > 0){
        selectedFields = {};
        for(let i = 0; i < fields.length; i++){
            if(attributeTabData.value[`${fields[i]}`]){
                selectedFields[`${fields[i]}`] = attributeTabData.value[`${fields[i]}`];
            }
        }
    }

    return (
        <>
            { Object.keys(selectedFields).length > 0 ?  <DynamicTable data={{...selectedFields}}/> : <div className='col-2 secondary-c font-30 font-bold j-center box-100'>No Data to Preview</div>}
        </>
    )
});

export default AttrTab;