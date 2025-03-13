export const cardFilterData = {
    formTitle: "Card Filter",
    classname: "col",
    fields: [
        {
            label: "Card Selection Tag",
            name: "cardSelectionTag",
            type: "textArr",
            placeholder: "Enter Tag name",
            value: ['amp-ad', 'amp-embed']
        },
        {
            label: "Card Loading Type",
            name: "cardLoadingType",
            type: "dropdown",
            selected: "all",
            value: ['loaded', 'not-loaded', 'all'],
        },
        {
            label: "Card Type",
            name: "cardType",
            type: "textArr",
            placeholder: "Enter Type name",
            value: ['doubleclick', 'colombia',  'taboola']
        },
    ],
};

export const attributeFilterData = {
    formTitle: "Attributes Filter",
    classname: "col",
    fields: [
        {
            label: "Which Attributes to Show",
            name: "attributesToShow",
            type: "textArr",
            placeholder: "Enter Attribute name",
            value: []
        }
    ],
};
export const networkFilterData = {
    formTitle: "Network Filter",
    classname: "col",
    fields: [
        {
            label: "Which Network Calls to Show",
            name: "networkCallsToShow",
            type: "textArr",
            placeholder: "Enter Network Call name",
            value: []
        }
    ],
};

export const insightFilterData = {
    formTitle: "Insight Filter",
    classname: "col",
    fields: [
        {
            label: "Which Insights to Show",
            name: "insightsToShow",
            type: "textArr",
            placeholder: "Enter Insight name",
            value: []
        }
    ],
};

export const otherFilterData = {
    formTitle: "Other Filter",
    classname: "col",
    fields: [
        {
            label: "Performance Url Domain",
            name: "performanceUrlDomain",
            type: "textArr",
            placeholder: "Enter Performance Url Domain",
            value: ['securepubads.g.doubleclick.net']
        },
        {
            label: "Special Characters After Ad Slot In URL",
            name: "specialCharactersAfterAdSlotInURL",
            type: "textArr",
            placeholder: "Enter Special Characters After Ad Slot In URL",
            value: ['&', '~', '%']
        },
    ],
};

export const filterData = {
    default: {
      index: 0,
      cardFilter: JSON.parse(JSON.stringify({...cardFilterData})),
      attributeFilter: JSON.parse(JSON.stringify({...attributeFilterData})),
      networkFilter: JSON.parse(JSON.stringify({...networkFilterData})),
      insightFilter: JSON.parse(JSON.stringify({...insightFilterData})),
      otherFilter: JSON.parse(JSON.stringify({...otherFilterData})),
    },
    customFilter: {
      index: 1,
      cardFilter: JSON.parse(JSON.stringify({...cardFilterData})),
      attributeFilter: JSON.parse(JSON.stringify({...attributeFilterData})),
      networkFilter: JSON.parse(JSON.stringify({...networkFilterData})),
      insightFilter: JSON.parse(JSON.stringify({...insightFilterData})),
      otherFilter: JSON.parse(JSON.stringify({...otherFilterData})),
    }
  }