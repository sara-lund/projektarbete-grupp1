const urlSCB = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301N/NTMI1301B"; // totala mängden

const urlSCB2 = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN"; // i sverige
  

querySCB = {
  "query": [
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": [
          "000000QS"
        ]
      }
    }
  ],
  "response": {
    "format": "json"
  }
};

querySCB2 = {
  "query": [
    {
      "code": "Uppkomst",
      "selection": {
        "filter": "item",
        "values": [
          "SE"
        ]
      }
    },
    {
      "code": "AmneMiljo",
      "selection": {
        "filter": "item",
        "values": [
          "CO2",
          "CH4",
          "N2O",
          "F-gas",
          "SO2",
          "NOx",
          "CO",
          "NMVOC",
          "NH3",
          "PM10",
          "PM2,5"
        ]
      }
    },
    {
      "code": "Produktgrupper",
      "selection": {
        "filter": "vs:COICOPMI1301(grov)n",
        "values": [
          "03"
        ]
      }
    },
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": [
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    }
  ],
  "response": {
    "format": "px"
  }
};