import React from 'react';
import DynamicForm from '../../../molecules/DynamicForm/DynamicForm';
import { selectedFilterSetting, filters, activeFilter } from '../../../signals/signals';
import { useComputed } from '@preact/signals';
import {setData} from '../../../utils/utils';

function NetworkSetting() {
  const networkFilter = useComputed(() => selectedFilterSetting.value.networkFilter); 

  const saveFilter = (data) => {
    selectedFilterSetting.value.networkFilter.fields = data;
    const confirmFunc = (response) => {
      console.log('Confirmed:', response);
    };
    setData('filters', filters.value, confirmFunc);
  }; 

  const resetFilter = () => {
    console.log('Clearing saved filter...');
    // Create a new reference to trigger a re-render
    saveFilter(JSON.parse(JSON.stringify(filters.value['default'].networkFilter.fields)));
    activeFilter.value = 'default';
  };

  const submit = {
    label: 'Save',
    action: 'submit',
    classname: 'white-c btn primary mt-10 f-right',
    onclick: saveFilter,
  };

  const reset = {
    tip: 'Reset Filter',
    classname: 'white-c btn light-red iconOnly',
    onclick: resetFilter, 
  };


  return (
    <div>
        <DynamicForm 
          filter={networkFilter.value} 
          submit={{ ...submit }} 
          reset={{ ...reset }} 
        />
    </div>
  );
}


export default NetworkSetting