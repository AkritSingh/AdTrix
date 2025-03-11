import React, {memo} from "react";
import './DynamicTable.css';
import Doc from "../../svg/doc";
import Button from "../../atoms/Button/button";
import {showPopup } from "../../utils/utils";

interface Props {
  [key: string]: any; // Any property name (string) can have any value (any)
}

function dataAnalyser(data){
  try {
      var updatedData = JSON.parse(data);
      if(typeof updatedData === 'number'){
        return `${updatedData}`
      }
      return updatedData;  // If no error is thrown, it's valid JSON
  } catch (e) {
      console.log(e);
  }
  try {
      const url = new URL(data);
      const hostname = url.hostname;
      const params = {};
      url.searchParams.forEach((value, key) => {
          params[key] = value;
      });
      return {
          hostname: hostname,
          parameters: params,
      };
  } catch (e) {
      console.log(e);
  }
  try {
      if(data.indexOf('&') !== -1 && data.indexOf('=') !== -1){
          const uData =  'https://example.com?' + data;
          const url = new URL(uData);
          const params = {};
          url.searchParams.forEach((value, key) => {
              params[key] = value;
          });
          return {
              parameters: params,
          };
      }
      
  } catch (e) {
      console.log(e);
  }
  return data;
}

function ViewDocHtml(item: string) {
  const handleClick = ()=>{
    const data = dataAnalyser(item);
    showPopup(() => typeof data === 'string' ? <div className="normalData">{data}</div> : <DynamicTable data = {{...data}} />);
  }

  const viewBtnProps = {
    tip: 'View Data',
    classname: 'white-c btn primary iconOnly viewBtn',
    onclick: handleClick,
}
  return (
    <div>
      <div className="normalText">{item}</div>
      <div className="viewDoc"></div>
      <Button {...viewBtnProps}><Doc/></Button>
    </div>
  );
};

function GenerateTable(data, level=0) {
  if (Array.isArray(data)) {
    // If the data is an array, iterate through its items
    return (
    <table cellSpacing="0" cellPadding="5" style={{borderCollapse: "collapse", width: "100%" }} className="generative">
      <tbody>
          {data.map((item, index)=>{
            return <>
                <tr>
                  <td className="keyIndex">{index + 1}</td>
                  <td>{typeof item === "object" ? GenerateTable(item, 1) : ViewDocHtml(item)}</td>
              </tr>
              </>
          })}
      </tbody>
    </table>
    );
  } else if (typeof data === "object" && data !== null) {
    // If the data is an object, iterate through its keys
   return (
   <table cellSpacing="0" cellPadding="5" style={{borderCollapse: "collapse", width: "100%" }} className="generative">
      <tbody>
      {Object.keys(data).map((key) => {
         return <tr>
            <td className="key">{key}</td>
            <td>{typeof data[key] === "object" ? GenerateTable(data[key], 1) : ViewDocHtml(data[key])}</td>
          </tr>
      })}
      </tbody>
    </table>);
  } else {
    // If the data is a primitive value, return it as a string
    return ViewDocHtml(data) ;
  }
}


const DynamicTable: React.FC<{ data: any;}> = memo(({data}) => {
  return (
  <div className="dynamicTable">
      <div className="tableWrapper">
      {GenerateTable(data)}
      </div>
  </div>);
});

export default DynamicTable