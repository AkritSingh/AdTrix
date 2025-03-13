import { adInfo,adAllAttr, adAllAttrOriginal,pageURL, perfURLs, adDetectTags, specialSyntaxAfterAd, filters, activeFilter,appliedFilter, popUpQue, promtData, comparedData, isComparing } from "../signals/signals";
interface AllAdFunctions {
    getAdData: () => void;
    getAdNetworkData: (adcode: string, setNetworkFetched: any, fetchCount: number,  type?: string) => void;
    setData: (name: string, data: any, confitmFunc: any) => void;
    getData: (name: string, setData: any) => void;
    clearData: (setData: any) => void;
}
interface NetworkDataProps {
    request: any;
    response: any;
}
declare global {
    interface Window {
      popQue: any; // Adjust the type as necessary
      showPopup: (Component: React.FC)  => void;
      allAdFunctions: AllAdFunctions;
    }
}

export const getAdData = () => {
    try {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: "transfer", data: {tag: adDetectTags.value, perfURLs: perfURLs.value, specialCh: specialSyntaxAfterAd.value} }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    return;
                }
                if (response?.data?.ads) { // Check if response.data.ads exists
                    adInfo.value ={...adInfo.value, ads: response.data.ads}; // directly update the nested signal
                    adAllAttr.value = response.data.allAttr;
                    adAllAttrOriginal.value = response.data.allAttr;
                    pageURL.value = response.data.url;
                } else {
                    console.warn("No ads data received from background script.");
                }
                return true;
            });
        }
    } catch (e) {
        console.log(e);
    }
};
export const getAdNetworkData = (adcode, setNetworkFetched, fetchCount, type) => {
    try {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: type || "transferNetwork", data: {tag: adDetectTags, perfURLs: perfURLs, specialCh: specialSyntaxAfterAd, adcode: adcode} }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    return;
                }
                setNetworkFetched({...response, fetchCount: fetchCount});
                return true;
            });
        }
    } catch (e) {
        console.log(e);
    }
};
export const setData = ( name, data, confitmFunc ) => {
    try {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: "setData", name: name, data: {...data} }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    return;
                }
                if(confitmFunc && typeof confitmFunc === 'function'){
                    confitmFunc(response);
                }
                return true;
            });
        }
    } catch (e) {
        console.log(e);
    }
};
export const getData = (name, setData) => {
    try {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: "getData", name: name }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    return;
                }
                if(setData && typeof setData === 'function'){
                    setData(response);
                }
                return true;
            });
        }
    } catch (e) {
        console.log(e);
    }
}
export const clearData = (setData) => {
    showPromt(`Are you sure you want to reset the settings?`,()=>{
        try {
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage({ action: "clearData" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                        return;
                    }
                    if(setData && typeof setData === 'function'){
                        setData(response);
                    }
                    return true;
                });
            }
        } catch (e) {
            console.log(e);
        }
      }, ()=>{});
    
}


export const setFunctionsToWindow = ()=>{
    if(window){
        window.allAdFunctions = {
            getAdData: getAdData,
            getAdNetworkData: getAdNetworkData,
            setData: setData,
            getData: getData,
            clearData: clearData,
        }
    } 
}


export const executeBeforePageReady = (func)=>{
    getAdData();
    var ready = 0;
    getData('filters',(response)=>{
        if (response?.data) {
            filters.value = response?.data;
        }
        ready += 1;
    });  
    getData('activeFilter',(response)=>{ 
        if (response?.data) {
            activeFilter.value = response?.data;
        }
        ready += 1;
    });
    getData('appliedFilter',(response)=>{
        console.log(response);
        appliedFilter.value = response?.data?.appliedFilter || 'default';
        ready += 1;
    });  
    getData('comparedData',(response)=>{
        console.log(response);
        comparedData.value = response?.data?.comparedData || [];
        ready += 1;
    });  
    if(ready === 4 && func && typeof func === 'function'){
        func();
    }
}

export const showPopup = (Component: React.FC) => {
    popUpQue.value = [...popUpQue.value, { id: `popup_${popUpQue.value.length}`, Component} ]
};

export const closePopup = (id: string) => {
    popUpQue.value = popUpQue.value.filter((popup) => popup.id !== id);
};

export const showPromt = (msg, onConfirm, onCancel, confirmText='', cancelText ='') => {
    promtData.value = {
        show: true,
        data: {
            msg: msg,
            onConfirm: onConfirm,
            onCancel: onCancel,
            confirmText: confirmText,
            cancelText: cancelText,
        }
    };
};

export const scrollIntoView = (adtrixId) => {
    try {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: "scrollIntoView", data: {adtrixId: adtrixId} }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    return;
                }
                return true;
            });
        }
    } catch (e) {
        console.log(e);
    }
};

export const pageRefresh = () => {
    window.location.reload();
};