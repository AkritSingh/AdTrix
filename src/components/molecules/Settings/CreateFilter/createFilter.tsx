import React from 'react'
import DynamicForm from '../../DynamicForm/DynamicForm';
import { filters, popUpQue,activeFilter } from '../../../signals/signals';
import {setData, showPromt, closePopup} from  '../../../utils/utils';
import { computed } from '@preact/signals';


function CreateFilter() {
    const createFilterForm = computed(()=>{
        return {
            formTitle: "Create New Filter",
            classname: "col",
            fields: [
                {
                    label: "Filter Name",
                    name: "filterName",
                    type: "text",
                    placeholder: "Enter Filter name",
                    value: ''
                },
                {
                    label: "Inherit From",
                    name: "inheritForm",
                    type: "dropdown",
                    selected: "default",
                    value: Object.keys(filters.value),
                }
            ],
        };
    })
    const onSubmit = (data)=>{
        const fields = data;
        if(Array.isArray(fields) && fields.length > 0){
            const filterName = fields.find((item) => item.name === 'filterName')?.value || null;
            const inheritFrom = fields.find((item) => item.name === 'inheritForm')?.selected || null;
            if(Object.keys(filters.value).includes(`${filterName}`)){
                showPromt(<><b>{filterName}</b> - Same Name Filter Already Exists</>, ()=>{}, undefined, 'OK');
            }else{
                const length = Object.keys(filters.value).length; 
                const value= JSON.parse(JSON.stringify(filters.value[inheritFrom]));
                filters.value[`${filterName}`] = {...value, index: length + 1};
                setData('filters', filters.value, (response)=>{
                    closePopup(`popup_${popUpQue.value.length-1}`);
                    activeFilter.value = `${filterName}`;
                })
            }
        }
    } 
    const submit = {
        label: 'Create',
        action: 'submit',
        classname: 'white-c btn primary mt-10 f-right',
        onclick: onSubmit,
      };

  return (
    <div>
        <DynamicForm filter={{...createFilterForm.value}} submit={submit} reset={()=>{}} noReset={true}/>
    </div>
  )
}

export default CreateFilter;