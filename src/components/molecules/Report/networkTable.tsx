import React, { useEffect, memo, useState } from "react";
import { signal, computed } from "@preact/signals-react";
import { adInfo, adAllAttr, attributeTabData, networkTabData, insightsTabData } from "../../signals/signals";
import { getAdNetworkData } from '../../utils/utils';

interface NetworkData {
  data:{
    hostname: string;
    request?: {
      requestTime: number;
      scrollPosition?: {
        viewport: number;
      };
    };
    response?: {
      responseTime: number;
    };
  };
}

interface NetworkTableProps {
  slot: string;
  index: number;
}

const NetworkTable: React.FC<NetworkTableProps> = memo(({ slot, index }) => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);

  useEffect(() => {
    getAdNetworkData(slot, setNetworkData, index, 'transferNetwork');
  }, [slot, index]);


const startTime: number = networkData?.data?.request?.requestTime ? parseFloat((networkData?.data?.request?.requestTime / 1000).toFixed(3)) : 0;
const endTime: number = networkData?.data?.response?.responseTime ? parseFloat((networkData?.data?.response?.responseTime / 1000).toFixed(3)) : 0;
  const duration = endTime && startTime ? (endTime - startTime).toFixed(3) : 0;
const reqUserPos: number = networkData?.data?.request?.scrollPosition?.viewport || 0;

  return (
    <>
     <td>{startTime || '-'}</td>
     <td>{endTime || '-'}</td>
     <td>{duration || '-'}</td>
     <td>{startTime == 0 ? '-' : reqUserPos}</td>
    </>
  );
});

export default NetworkTable;
