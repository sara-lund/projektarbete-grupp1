// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

// Länk för att hämta ut data för totala utsläpp i industrin 2013-2022
const urlSCB =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/TotaltUtslappN";

// JSON-fråga
const querySCB = {
  query: [
    {
      code: "Vaxthusgaser",
      selection: {
        filter: "item",
        values: ["CO2-ekv."],
      },
    },
    {
      code: "Sektor",
      selection: {
        filter: "item",
        values: ["4.0"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: [
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
        ],
      },
    },
  ],
  response: {
    format: "json",
  },
};

// Post request som sedan skickas med fetch
const request = new Request(urlSCB, {
  method: "POST",
  // Översätter till JSON?
  body: JSON.stringify(querySCB),
});

// Fetch för att hämta data från SCB
fetch(request)
  // Översätter svaret (datan) från JSON
  .then((response) => response.json())
  .then((scbData) => {
    // skriver ut en array av info från länken
    console.log(scbData);

    values = scbData.data.map((value) => value.values[0]);
    console.log(values);

    // sparar ner utsläpp av växthusgaser som values
    for (let i = 0; i < values.length; i++) {
      values[i] *= 1000;
    }

    console.log(values);

    // sparar ner årtal som labels
    const labels = scbData.data.map((value) => value.key[2]);
    console.log("Årtal", labels);

    // skapar linjediagram
    const datasets = [
      {
        data: values,
        pointRadius: 0,
        borderWidth: 0,
        tension: 0.4,
        fill: "origin",
        backgroundColor: "#8fbabf50",
      },
    ];

    const data = {
      labels,
      datasets,
    };

    console.log(data);

    const annotation1 = {
      type: "line",
      borderColor: "#1e424a",
      borderDash: [6, 6],
      borderWidth: 1,
      xMax: 4,
      xMin: 4,
      yMax: 0,
      yMin: 17500000,
    };

    const annotation2 = {
      type: "line",
      borderColor: "#1e424a",
      borderDash: [6, 6],
      borderWidth: 1,
      xMax: 8,
      xMin: 8,
      yMax: 0,
      yMin: 17500000,
    };

    const config = {
      type: "line",
      data,
      options: {
        plugins: {
          annotation: {
            annotations: {
              annotation1,
              annotation2,
            },
          },

          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Ton",
              padding: 10,
            },
            display: true,
            min: 14500000,
            max: 17500000,
          },
        },
      },
    };

    // visar diagrammet
    const canvas = document.getElementById("canvas");
    const createChart = new Chart(canvas, config);
  });
