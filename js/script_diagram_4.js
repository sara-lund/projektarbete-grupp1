// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

// hämta url
const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HA/HA0201/HA0201B/ImpExpKNTotAr";

// formulera förfrågan, json
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

// skapar en förfrågan till angiven url
const request = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

// använder fetch för att skicka förfrågan/request
fetch(request)
  .then((response) => response.json())
  .then((scbData) => {
    // dubbelkolla datan
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

    // sumerar import samt export
    const sumValuesIm = values61Im.map((value, i) => {
      const sum = Number(value) + Number(valuesImport[i]);
      return sum;
    });

    const sumValuesEx = values61Ex.map((value, i) => {
      const sum = Number(value) + Number(valuesExport[i]);
      return sum;
    });

    console.log("Import summerat:", sumValuesIm);
    console.log("Export summerat:", sumValuesEx);

    // bestämmer utseende för dataseten
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

    // anger vad som ska användas som data i diagrammen
    const data = {
      labels,
      datasets,
    };

    const data2 = {
      labels,
      datasets: datasets2,
    };

    console.log(data);
    console.log(data2);

    // justerar diagram
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

    // justerar diagram 2
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

    // hämtar canvaselement med id "diagram-1" / "diagram-2" och skapar diagrammen
    const canvas = document.getElementById("diagram4-1");
    const createChart = new Chart(canvas, config);

    const canvas2 = document.getElementById("diagram4-2");
    const createChart2 = new Chart(canvas2, config2);
  });
