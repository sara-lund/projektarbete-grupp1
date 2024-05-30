// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

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
        values: ['2017', "2018", "2019", "2020", "2021"],
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

    // Innehåller alla värden för import både 62 och 61
    const valuesImport = scbData.data.map((data) => data.values[0]);
    console.log("Import värden:", valuesImport);

    // Innehåller alla värden för export både 62 och 61
    const valuesExport = scbData.data.map((data) => data.values[1]);
    console.log("Export värden:", valuesExport);

    const values61Ex = valuesExport.splice(0, labels.length);

    const values61Im = valuesImport.splice(0, labels.length);

    // Byta ut till värden för 62 så att det summeras med 61
    const sumValuesIm = values61Im.map((value, i) => {
      const sum = Number(value) + Number(valuesImport[i]);
      return sum;
    });

    const sumValuesEx = values61Ex.map((value, i) => {
      const sum = Number(value) + Number(valuesExport[i]);
      return sum;
    });

    // const data = valuesRaw.splice(0, labels.length);

    console.log("Import summerat:", sumValuesIm);
    console.log("Export summerat:", sumValuesEx);

    const datasets = [
      {
        label: "ton",
        data: sumValuesIm,
        backgroundColor: [
          "hsla(186, 50%, 65%, 0.65)",
          "hsla(345, 100%, 92%, 0.65)",
          "hsla(111, 80%, 84%, 0.65)",
          "hsla(318, 60%, 83%, 0.65)",
        ],
      },
    ];
    const datasets2 = [
      {
        label: "ton",
        data: sumValuesEx,
        backgroundColor: [
          "hsla(186, 60%, 65%, 0.65)",
          "hsla(345, 100%, 92%, 0.65)",
          "hsla(111, 90%, 84%, 0.65)",
          "hsla(318, 70%, 83%, 0.65)",
        ],
      },
    ];

    console.log(datasets);
    const data = {
      //labels hämtade från scb på rad 53
      labels,
      datasets,
    };

    const data2 = {
      //labels hämtade från scb på rad 53
      labels,
      datasets: datasets2,
    };

    console.log(data);

    // Config för import diagram
    const config = {
      type: "polarArea",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Import (i ton)",
          },
        },
        responsive: true,
        scale: {
          suggestedMax: 90000,
        },
      },
    };

    // Config för export diagram
    const config2 = {
      type: "polarArea",
      data: data2,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Export (i ton)",
          },
        },
        responsive: true,
        scale: {
          suggestedMax: 160000,
        },
      },
    };

    //hämtar canvaselement med id scb
    const canvas = document.getElementById("diagram4-1");
    const createChart = new Chart(canvas, config);

    const canvas2 = document.getElementById("diagram4-2");
    const createChart2 = new Chart(canvas2, config2);
  });
