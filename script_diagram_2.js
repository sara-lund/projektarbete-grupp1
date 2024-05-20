const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

querySCB = {
  query: [
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
    const labelsRaw = SCBdata.data.map((label) => label.key[3]);

    // Kombinerar dubletter av årtal till ett enda årtal
    const labels = [...new Set(labelsRaw)];
    console.log("Årtal", labels);

    const valuesRaw = SCBdata.data.map((value) => value.values[0]);
    console.log("Råa värden", valuesRaw);

    const sumYear = [...new Set(labelsRaw)];
    console.log(sumYear);

    // tom array att använda för summan
    let summa = {};
    
    // summa för varje år tilldelas värde 0
    labels.forEach(label => {
      summa[label] = 0;
    });
    console.log(summa);

    // loop för att summera mängd/år
    for (let i = 0; i < SCBdata.data.length; i++) {
      const label = SCBdata.data[i].key[3];
      const value = parseFloat(SCBdata.data[i].values[0]);
      
      // summan för varje år, label, sparas ner
      summa[label] += value;
    }
    console.log("Summa för respektive år: ", summa); 

    // skapar en array 
    const values = sumYear.map((label) => summa[label]);
    console.log(values);

   /*  // loop för att summera mängd/år för kläder

    // tom array att använda för summan
    let summa = {};

    for (let i = 0; i < SCBdata.data.length; i++) {
      if (SCBdata.data[i].key[1] === "3"){
      const label = SCBdata.data[i].key[2];
      const value = parseFloat(SCBdata.data[i].values[0]);
      
      // summan för varje år, label, sparas ner
      summa2[label] += value;
      }
    }
    console.log("Summa för respektive år: ", summa2);  */

    const datasets = [{
      labels,
      data: values,
    }];

    console.log(datasets);

    const data = {
      labels,
      datasets,
    };

    console.log(data);

    const config = {
      type: "line",
      data,
    }

    //hämtar canvaselement med id diagram 2
    const canvas = document.getElementById("diagram2");
    const testing = new Chart(canvas, config);
});
