//hitta url
const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HA/HA0201/HA0201B/ImpExpKNTotAr";

//info kring diagrammet
querySCB = {
  query: [
    {
      code: "VarugruppKN",
      selection: {
        filter: "vs:KNOriginalNivå2A",
        values: ["61", "62"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["HA0201AL", "HA0201AN"],
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

//skapa förfrågan till given url, med given data som API:et vill ha
const request = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

//skicka själva förfrågan via HTTP med fetch api
fetch(request)
  //gör om till json
  .then((response) => response.json())
  //callback som körs när data hämtats färdigt.
  .then((scbData) => {
    //titta på data
    console.log(scbData);

    const labelsRaw = scbData.data.map((data) => data.key[1]);
    console.log(labelsRaw);

    const labels = [...new Set(labelsRaw)];
    console.log(labels);

    const valuesImport = scbData.data.map((data) => data.values[0]);
    console.log(valuesImport);

    const valuesExport = scbData.data.map((data) => data.values[1]);
    console.log(valuesExport);


    const datasets3 = []

    for (let i = 0; i < labels.length; i++) {
      var sumType = 0;

      var nr1 = Number(valuesImport[i]);
      var nr2 = Number(valuesImport[i + 4]);

      sumType += nr1;
      sumType += nr2;

      console.log('testing2', sumType);

      datasets3[i] = {
        data: sumType,
      };

      console.log(datasets3);
    }


    // const data = valuesRaw.splice(0, labels.length);

    const datasets = [
      { label: "Import", data: valuesImport },
    ];

    
    const datasets2 = [
      { label: "Export", data: valuesExport },
    ];

    console.log(datasets);
    console.log(datasets2);

    const data = {
      //labels hämtade från scb på rad 53
      labels,
      datasets,
    };

    const data2 = {
      //labels hämtade från scb på rad 53
      labels,
      datasets:datasets2,
    };

    console.log(data);
    console.log(data2);


    
    const data3 = {
      //labels hämtade från scb på rad 53
      labels,
      datasets: datasets3,
    };

    console.log(data3);

    //charat type line istället för bar
    const config = {
      type: "polarArea",
      data: data,
      options: {
        scale: {},
      },
    };

    const config2 = {
      type: "polarArea",
      data: data2,
      options: {
        scale: {
          suggestedMax: 90000,
        },
      },
    };

    
    const config3 = {
      type: "polarArea",
      data: data3,
      options: {
      },
    };

    //hämtar canvaselement med id scb
    const canvas = document.getElementById("diagram4");
    const testing = new Chart(canvas, config);

    //hämtar canvaselement med id scb
    const canvas2 = document.getElementById("diagram4_2");
    const testing2 = new Chart(canvas2, config2);

    
    //hämtar canvaselement med id scb
    const canvas3 = document.getElementById("diagram4_3");
    const testing3 = new Chart(canvas3, config3);

  });
