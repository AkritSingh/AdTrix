import React from 'react'
import './mainSettings.css'
import AttributeSetting from './childSettings/attributeSetting';
import NetworkSetting from './childSettings/networkSetting';
import InsightsSetting from './childSettings/insightsSetting';
import OthersSetting from './childSettings/othersSetting';
import CardSetting from './childSettings/cardSetting';
import {activeSetting} from '../../signals/signals';
import Button from '../../atoms/Button/button';
import { filters, activeFilter, appliedFilter  } from "../../signals/signals";
import { setData, showPopup, showPromt, clearData, pageRefresh } from '../../utils/utils';
import CreateFilter from './CreateFilter/createFilter';
import { computed } from '@preact/signals';


function mainSettings() {
  const createFilterForm = computed(()=>Object.entries(filters.value) // Convert object to array of [key, value] pairs
    .map(([key, obj], index) => ({ key, ...(obj as { index?: number })})) // Ensure index is optional
    .sort((a, b) => (a.index) - (b.index ))
  );
  const onDel = () =>{
    showPromt(`Are you sure you want to delete ${activeFilter.value} filter?`,()=>{
      if(appliedFilter.value === activeFilter.value){
        appliedFilter.value = 'default';
      }
      filters.value = Object.keys(filters.value)
        .filter(key => key !== activeFilter.value)
        .reduce((acc, key) => ({ ...acc, [key]: filters.value[key] }), {});
      activeFilter.value = 'default';
      setData('filters',filters.value, (response)=>{
        if(response){console.log('saved');}
      })
      setData('appliedFilter',{appliedFilter: appliedFilter.value}, (response)=>{
        if(response){console.log('saved');}
      })
    }, ()=>{});
  }
  const onApply = () =>{
    showPromt(`Are you sure you want to apply ${activeFilter.value} filter?`,()=>{
      appliedFilter.value = activeFilter.value;
      setData('appliedFilter',{appliedFilter: appliedFilter.value}, (response)=>{
        if(response){console.log('saved');}
      })
    }, ()=>{});
  }

  const applyBtnProps = {
      tip: 'Active Current Filter',
      classname: 'white-c btn primary apply font-12',
      onclick: onApply,
      tipDir: 'top-right'
  }

  const deleteBtnProps = {
    tip: 'Delete Current Filter',
    classname: 'white-c btn light-red delete font-12',
    onclick: onDel,
    tipDir: 'top-left'
  }

  const pillBtnProps = {
    classname: 'white-c btn primary iconOnly pill',
    onclick: ()=>{},
  }

  const clearSettingBtnProps = {
    classname: 'white-c btn primary iconOnly create-pill reset pill',
    onclick: ()=>{clearData(pageRefresh)},
  }

  const createPillBtnProps = {
    classname: 'white-c btn primary iconOnly create-pill pill',
    onclick: ()=>{
      showPopup(()=><CreateFilter/>)
    },
  }

  return (
    
    <div className='mainSettings'>
        <div className='info-toolbar'>
            <div className={`tab ${activeSetting.value === 'Cards' ? 'active' : ''}`} onClick={()=>activeSetting.value = 'Cards'}>Cards</div>
            <div className={`tab ${activeSetting.value === 'Attributes' ? 'active' : ''}`} onClick={()=>activeSetting.value = 'Attributes'}>Attributes</div>          
            <div className={`tab ${activeSetting.value === 'Network' ? 'active' : ''}`} onClick={()=>activeSetting.value = 'Network'}>Network</div>
            {/* <div className={`tab ${activeSetting.value === 'Insights' ? 'active' : ''}`} onClick={()=>activeSetting.value = 'Insights'}>Insights</div> */}
            <div className={`tab ${activeSetting.value === 'Others' ? 'active' : ''}`} onClick={()=>activeSetting.value = 'Others'}>Others</div>
        </div>
        <div className='pills'>
          {createFilterForm.value &&
            createFilterForm.value// Convert object to array of [key, value] pairs
              // .map(([key, obj], index) => ({ key, ...(obj as { index?: number })})) // Ensure index is optional
              // .sort((a, b) => (a.index) - (b.index )) // Sort by index, fallback to originalIndex
              .map((item, index) => (
                <Button key={`pill_${index}`} {...pillBtnProps} classname={`white-c btn primary iconOnly pill ${item.key === activeFilter.value ? 'active' : ''} ${item.key === appliedFilter.value ? 'applied' : ''}`}
                onclick={()=>{activeFilter.value = item.key;}}>
                  {item.key}
                </Button>
              ))
          }
          <Button {...clearSettingBtnProps}>Reset All Settings</Button>
          <Button {...createPillBtnProps}>Create Filter</Button>
        </div>
        <div className='tabContent'>
          {activeFilter.value !== 'default' && (
            <>
            {activeSetting.value === 'Cards' && <CardSetting/>}
            {activeSetting.value === 'Attributes' && <AttributeSetting/>}
            {activeSetting.value === 'Network' && <NetworkSetting/>}
            {/* {activeSetting.value === 'Insights' && <InsightsSetting/>} */}
            {activeSetting.value === 'Others' && <OthersSetting/>}
            </>
          )}
            <div className='btns'>
              <Button {...applyBtnProps}>Apply</Button>
              {activeFilter.value !== 'default' && <Button {...deleteBtnProps}>Delete</Button>} 
            </div>
        </div>
    </div>
  )
}

export default mainSettings