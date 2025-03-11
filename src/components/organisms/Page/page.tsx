import React, {useEffect, useState, memo } from 'react';
import './page.css';
import Header from '../../molecules/Header/header';
import Container from '../../molecules/Container/container';
import PopUpWrapper from '../../molecules/PopUpWrapper/PopUpWrapper';
import { setFunctionsToWindow, executeBeforePageReady } from '../../utils/utils';
import { promtData } from '../../signals/signals';
import CustomPrompt  from '../../atoms/CustomPromt/cutomPromt';


const Page = memo(() => { 
    const [pageReady, setPageReady] = useState(false);
    useEffect(()=>{
        if(window){
            window.popQue = [];
            setFunctionsToWindow();
            executeBeforePageReady(()=>{});
            setPageReady(true);
        }
    },[])

    return (    
        <>
            {
                pageReady && <div>
                    <Header/>
                    <PopUpWrapper />
                    <Container/>
                    { (promtData.value as { show: boolean }).show && <CustomPrompt/> }

                </div>
            }
            
        </>
    )
});

export default Page;
