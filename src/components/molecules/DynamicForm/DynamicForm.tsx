import React, {useState} from 'react';
import './DynamicForm.css';
import { useSignal, effect } from '@preact/signals';
import Button from '../../atoms/Button/button';
import { selectedFilterSetting, filters, activeFilter } from '../../signals/signals';
import Reset from '../../svg/reset';
import InputArr from './InputArr';

type fieldType = {
  name: string;
  type: string;
  value: any;
  label: string;
  selected?: string;
};

function DynamicForm(props) {
  const { filter, submit, reset = () => {}, noReset = false } = props;
  const { formTitle, fields } = filter;
  const fieldsSignal = useSignal(fields); // Signal to store form state

const onChangeField = (index: number, newValue: any, type: string) => {
  fieldsSignal.value = fieldsSignal.value.map((field, i) => {
    if (i === index) {
      if (type === 'dropdown') {
        field.selected = newValue;
      } else {
        field.value = newValue;
      }
    }
    return field;
  });

  // Force update by re-assigning `.value`
  fieldsSignal.value = [...fieldsSignal.value]; 
};

  
  const onSubmit = () => {
    if(submit.onclick && typeof submit.onclick === 'function'){
      submit.onclick(JSON.parse(JSON.stringify(fieldsSignal.value)));
    }
  };

  const submitProps ={
    ...submit,
    onclick: onSubmit,
  }

  effect(()=>{
    fieldsSignal.value = fields;
  })
  return (
    <div className="dynamicForm">
      <form className="form" onSubmit={onSubmit}>
        <fieldset className="mb-10 mt-10">
          <legend className="font-12 font-bold">
            {formTitle}
            {!noReset && <Button {...reset}><Reset /></Button>}
          </legend>

          {fieldsSignal.value.map((item: fieldType, index: number) => (
            <div key={`field_${index}`}>
              <label>{item.label}</label>
              {item.type === 'text' && (
                <input
                  type="text"
                  value={item.value}
                  name={item.name}
                  onChange={(e) => onChangeField(index, e.target.value, 'input')}
                />
              )}
              {item.type === 'textArr' && (
                <InputArr
                  name={item.name}
                  values={item.value}
                  onChange={(newValue) => onChangeField(index, newValue, 'inputArr')}
                />
              )}
              {item.type === 'dropdown' && (
                <select
                  name={item.name}
                  value={item.selected}
                  onChange={(e) => onChangeField(index, e.target.value, 'dropdown')}
                >
                  {Array.isArray(item.value) &&
                    item.value.map((opt, i) => (
                      <option key={`option_${i}`} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              )}
            </div>
          ))}

          <Button  {...submitProps}>{submitProps?.label || "Submit"}</Button> 
        </fieldset>
      </form>
    </div>
  );
}

export default DynamicForm;
