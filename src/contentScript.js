console.log('contentScript loaded');

var s = document.createElement("script");
s.src = chrome.runtime.getURL("fetchNetwork.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);


const style = document.createElement("style");
style.innerHTML = `
.adtrix-blink-effect {
    animation: adtirxBlinkAnimation 1s infinite;
}

@keyframes adtirxBlinkAnimation {
    0% { opacity: 1; }   /* Fully visible */
    50% { opacity: 0.2; } /* Reduced opacity */
    100% { opacity: 1; }  /* Fully visible again */
}
`;
(document.head || document.documentElement).appendChild(style);


function getFreshAdtrixData(type) {
  return new Promise((resolve) => {
      // Listen for fresh data response
      function onMessage(event) {
          if (event.source !== window || event.data?.type !== "ADTRIX_DATA_RESPONSE") return;
          window.removeEventListener("message", onMessage); // Clean up listener
          if(type == 'all'){
            resolve(event.data.allData)
          }else{
            resolve(event.data.data);
          }
          
      }

      window.addEventListener("message", onMessage);
      
      // Send request for fresh data
      window.postMessage({ type: "REQUEST_ADTRIX_DATA" }, "*");
  });
}

function filterNetwork(perfURLs, specialCh, adcode) {
  return new Promise((resolve) => {
      // Listen for fresh data response
      getFreshAdtrixData('ad_spec').then((adtrixdata) => {
        try{
          if(adtrixdata){
            for(let a = 0; a < perfURLs.length; a++){
              const req = perfURLs[a];
              if(adtrixdata[req]){
                const data = adtrixdata[req];
                for(let b=0; b<data.length; b++){
                  const adItem = data[b];
                  for(let c=0; c<specialCh.length; c++){
                    const ad = adcode + specialCh[c];
                    if(adItem.request.url.includes(ad)){
                      resolve(adItem);
                    }
                  }
                }
              }
            }
          }else{
            console.log('filterNetwork error');
            resolve();
          } 
        }catch(e){
          console.log(e);
          resolve(e);
        }
      });
  });  
}

function allNetworks(specialCh, adcode) {
  return new Promise((resolve) => {
      // Listen for fresh data response
      getFreshAdtrixData('all').then((adtrixdata) => {
        try{
          if(adtrixdata && Array.isArray(adtrixdata) && adtrixdata.length >0){
            var filteredData = [];
            for(let c=0; c<specialCh.length; c++){
              const ad = adcode + specialCh[c];
              adtrixdata.filter((item)=> item.url.includes(ad))
              .forEach((item)=> filteredData.push(item))
            }
            resolve(filteredData);
          }else{
            console.log('all filterNetwork error');
            resolve();
          } 
        }catch(e){
          console.log(e);
          resolve(e);
        }
      });
  });  
}

function isElementOrParentFixed(element) {
  while (element) {
      const computedStyle = window.getComputedStyle(element);
      
      // Check if the element itself is fixed
      if (computedStyle.position === "fixed") {
          return true;
      }

      // Check if the element is an AMP-specific tag
      if (["amp-sticky-ad", "amp-lightbox"].includes(element.tagName)) {
          return true;
      }

      element = element.parentElement; // Move up the DOM tree
  }
  return false;
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "transfer") {
    var ads = [];
    try{
      const {tag} = request.data || {}
      if(tag && Array.isArray(tag) &&  tag.length >0){
        ads = document.querySelectorAll(tag.toString());
      }else{
        ads = document.querySelectorAll('amp-ad');
      } 

       
      var adsData = [];
      var allAttr = [];
      for(let i=0; i<ads.length; i++){
         ads[i].setAttribute('data-adtrix_id', `adtrix_${i}`);
         
          var attributes = {};
          for(let j=0; j<ads[i].attributes.length; j++){
            attributes[ads[i].attributes[j].nodeName] = ads[i].attributes[j].nodeValue;
            if(!allAttr.includes(ads[i].attributes[j].nodeName)){
              allAttr.push(ads[i].attributes[j].nodeName);
            }
          }
          var windowHeight = document.documentElement.clientHeight || 1;
          var relPos = document.body.getBoundingClientRect().top || 0;
          var adpos = ads[i].getBoundingClientRect()?.top || 0;
          
          if(relPos <0){
            posTop = -(relPos) + adpos;
            if(adpos < 0){
              posTop =  Math.abs(adpos) - Math.abs(relPos)
            }
          }else{
            posTop =  Math.abs(adpos) - Math.abs(relPos)
          }
          if(adpos == 0){
            posTop = 0;
          }
          if(isElementOrParentFixed(ads[i])){
            posTop = adpos;
          }
          var posTop = ( Math.abs(posTop) / windowHeight).toFixed(3);
          adsData[i] = {attributes: {...attributes}, positionTop: posTop || 0};
          adsObj = {};
          // const pEl = ads[i].parentElement;
          // const hasChildWithClass = pEl.querySelector('.ampAdInspect') == null;
      }
      ads = adsData;
    }catch(e){
      ads = null;
    }
    sendResponse({ ads, allAttr, url: window.location.href});
  }
  if (request.msg === "transferNetwork") {
      const {perfURLs, specialCh, adcode} = request.data || {}
      filterNetwork(perfURLs, specialCh, adcode).then((data)=>{
        try{
          sendResponse(data)
        }catch(e){
          sendResponse({error: e});
        };
      })
  }
  if (request.msg === "transferAllNetwork") {
    const {specialCh, adcode} = request.data || {}
    allNetworks(specialCh, adcode).then((data)=>{
      try{
        sendResponse(data)
      }catch(e){
        sendResponse({error: e});
      };
    })
  }
  if (request.msg === "scrollIntoView") {
    const {adtrixId} = request.data || {};
    const adElement = document.querySelector(`[data-adtrix_id="${adtrixId}"]`);
    if (adElement) {
        adElement.scrollIntoView({ behavior: "smooth", block: "center" });
        adElement.classList.add("adtrix-blink-effect");
        setTimeout(() => {
          adElement.classList.remove("adtrix-blink-effect");
        }, 5000);
        sendResponse({ success: true });
    }else{
      sendResponse({ success: false, msg: "Element not found" });
    }
  }
  // Return true to keep the message port open for async operations
  return true;
});
