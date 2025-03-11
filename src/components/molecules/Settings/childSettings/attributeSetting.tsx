import React, {useEffect, useState} from 'react';
import DynamicForm from '../../../molecules/DynamicForm/DynamicForm';
import { selectedFilterSetting, filters, activeFilter } from '../../../signals/signals';
import { effect, useComputed } from '@preact/signals';
import {setData, showPromt} from '../../../utils/utils';

function AttributeSetting() {
  
  const attributeFilter = useComputed(() => selectedFilterSetting.value.attributeFilter); 
  const saveFilter = (data, promt=true) => {
    
    if(promt){
      showPromt(`Changes are saved`,()=>{
        selectedFilterSetting.value.attributeFilter.fields = data;
        const confirmFunc = (response) => {
          console.log('Confirmed:', response);
        };
        setData('filters', filters.value, confirmFunc);
      }, undefined);
    }else{
      selectedFilterSetting.value.attributeFilter.fields = data;
      const confirmFunc = (response) => {
        console.log('Confirmed:', response);
      };
      setData('filters', filters.value, confirmFunc);
    }
    
  }; 

  const resetFilter = () => {
    console.log('Clearing saved filter...');
    // Create a new reference to trigger a re-render
    showPromt(`Are you sure you want to reset this filter?`,()=>{
      saveFilter(JSON.parse(JSON.stringify(filters.value['default'].attributeFilter.fields)), false);
      activeFilter.value = 'default';
    }, ()=>{});
    
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
          filter={attributeFilter.value} 
          submit={{ ...submit }} 
          reset={{ ...reset }} 
        />
    </div>
  );
}

export default AttributeSetting;