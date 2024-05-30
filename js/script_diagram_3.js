// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

// hämta url
const urlSCB =
  " https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

// formulera förfrågan, json
querySCB = {
  query: [
    {
      code: "Uppkomst",
      selection: {
        filter: "item",
        values: ["SE"],
      },
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
        filter: "vs:COICOPMI1301(grov)n",
        values: ["03"],
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
    format: "json",
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

    // sparar ner årtal som labels
    const labelsRaw = scbData.data.map((data) => data.key[3]);
    console.log(labelsRaw);

    // sparar ner värden 
    const valuesRaw = scbData.data.map((data) => data.values[0]);
    console.log(valuesRaw);

    // sparar ner växthusgas-sort 
    const gases = scbData.data.map((value) => value.key[1]);
    console.log("Växthusgas", gases);

    const labels = [...new Set(labelsRaw)];
    console.log(labels);

    const gases2 = [...new Set(gases)];
    console.log(gases2);

    // utvecklad beskrivning av växthusgaser
    const gas = [
      "Koldioxid",
      "Metan",
      "Lustgas",
      "Fluorerande växthusgaser",
      "Svaveldioxid",
      "Kväveoxider",
      "Kolmonoxid",
      "Flyktiga organiska ämnen",
      "Ammoniak",
      "Partiklar, diameter <10 mikrometer",
      "Partiklar, diameter <2,5 mikrometer",
    ];

    // deklarerar tom variabel, för att använda i loop
    const datasets = [];

    // delar upp datasetet i växthusgaser (sorter)
    for (let i = 0; i < gases2.length; i++) {
      const data = valuesRaw.splice(0, labels.length);

      // färger till diagrammet
      const colors = [
        "#8fbabf",
        "#ffd6e0",
        "#c8ebc2",
        "#e1c6d9",
        "#bebeda",
        "#fbf7b1",
        "#f2d1ae",
        "#ffadad",
        "#aecca3",
        "#C8E3E4",
        "#E4F1F2",
      ];

      console.log(i);

      // bestämmer utseende för datasetet, en ny färg per dataset
      datasets[i] = {
        label: gases2[i] + ": " + gas[i],
        data,
        backgroundColor: colors[i],
      };
    }

    console.log(datasets);

    // anger vad som ska användas som data i diagrammet
    const data = {
      labels,
      datasets,
    };

    console.log(data);

    // justerar diagram
    const config = {
      type: "bar",
      data,
      options: {
        plugins: {
          legend: {
            labels: {
              boxHeight: "5",
              font: {
                size: 10,
              },
            },
          },
          customCanvasBackgroundColor: {
            color: "white",
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            title: {
              display: true,
              text: "Ton",
              padding: 10,
            },
            stacked: true,
          },
        },
      },
    };

    // hämtar canvaselement med id "diagram 3" och skapar diagrammet
    const canvas = document.getElementById("diagram3");
    const createChart3 = new Chart(canvas, config);
  });
