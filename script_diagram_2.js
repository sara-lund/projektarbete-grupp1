const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

querySCB = {
  query: [
    {
      code: "AmneMiljo",
      selection: {
        filter: "item",
        values: [
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
          "PM2,5",
        ],
      },
    },
    {
      code: "Produktgrupper",
      selection: {
        filter: "vs:COICOPMI1301(område)n",
        values: ["1", "2", "3", "4", "5"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: ["2018", "2019", "2020", "2021"],
      },
    },
  ],
  response: {
    format: "JSON",
  },
};

const request = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

fetch(request)
  .then((response) => response.json())
  .then((SCBdata) => {
    console.log(SCBdata);

    // Hämta ut årtalen
    const labelsRaw = SCBdata.data.map((label) => label.key[2]);

    // Kombinerar dubletter av årtal till ett enda årtal
    const labels = [...new Set(labelsRaw)];
    console.log("Årtal", labels);

    const valuesRaw = SCBdata.data.map((value) => value.values[0]);
    console.log("Råa värden", valuesRaw);
  });
