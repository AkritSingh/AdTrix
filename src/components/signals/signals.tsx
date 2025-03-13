import { signal, computed } from "@preact/signals-react";
import {filterData } from "./globalFilterData";
// signals.tsx (or a separate types.d.ts file)

interface Ad {
    [key: string]: any; // Any property name (string) can have any value (any)
}
interface AdArray extends Array<Ad> {
  // You can add custom methods or properties here if needed
}
type FiltersType = {
  [key: string]: {
    [key: string]: string | number | any;
  };
};
interface AdInfo {
    ads: Ad[];
    network?: {
      startTime: number;
      endTime: number;
      duration: number | string;
      reqUserPos: number;
    };
}

export const adInfo = signal<AdInfo>({ ads: [] });
export const adAllAttr = signal([]);
export const adAllAttrOriginal = signal([]);

export const count = signal(0);
export const pageURL = signal('');












// using
export const activeCardIndex = signal<number>();
export const activeTab = signal<string>('Attributes');
export const activeSetting = signal<string>('Cards');
export const promtData = signal<object>({show: false, data: {}});
export const filters = signal<FiltersType>(filterData);
export const activeFilter = signal<string>('default');
export const appliedFilter = signal<string>('default');
export const selectedFilterSetting = computed(() => filters.value[activeFilter.value]);
export const appliedFilterSetting = computed(() => filters.value[appliedFilter.value]);
export const adDetectTags = computed(()=> appliedFilterSetting.value.cardFilter.fields[0].value);
export const perfURLs = computed(()=> appliedFilterSetting.value.otherFilter.fields[0].value); 
export const specialSyntaxAfterAd = computed(()=> appliedFilterSetting.value.otherFilter.fields[1].value); 
export const createFilterForm = computed(()=>{
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
export const popUpQue = signal([]);
export const attributeTabData = signal<Record<string, any>>({});
export const networkTabData = signal<Record<string, any>>({});
export const insightsTabData = signal<Record<string, any>>({});

export const comparedData= signal([]);
export const isComparing = computed(()=>Array.isArray(comparedData.value) && comparedData.value.length > 0 && comparedData.value.length <  100);
