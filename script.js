// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

// Länk för att hämta ut data för totala utsläpp i industrin 2013-2022
const testDataUrl =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/TotaltUtslappN";

// JSON-fråga
const testQuery = {
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

/* Markerar linje, där segmentpunkten är större än 4 och mindre än 8. Färg på 
linje utanför intervallet bestäms av value. */

const color = (ctx, value) =>
  ctx.p0DataIndex > 4 && ctx.p0DataIndex < 8 ? value : "#C1C1C1";

// Post request som sedan skickas med fetch
const request = new Request(testDataUrl, {
  method: "POST",
  // Översätter till JSON?
  body: JSON.stringify(testQuery),
});

// Fetch för att hämta data från SCB
fetch(request)
  // Översätter svaret (datan) från JSON
  .then((response) => response.json())
  .then((testData) => {
    // skriver ut en array av info från länken
    console.log(testData);

    // sparar ner utsläpp av växthusgaser som values
    const values = testData.data.map((value) => value.values[0]);
    console.log(values);

    // sparar ner årtal som labels
    const labels = testData.data.map((value) => value.key[2]);
    console.log("Årtal", labels);

    // skapar linjediagram
    const datasets = [
      {
        data: values,
        backgroundColor: "#F39EBB",
        //pointRadius: 0,
        segment: {
          borderColor: (ctx) => color(ctx, "black"),
        },
        tension: 0.4,
        pointBackgroundColor: "black",
        pointBorderColor: "black",
      },
    ];

    const data = {
      labels,
      datasets,
    };

    console.log(data);

    const annotation1 = {
      type: "line",
      borderColor: "green",
      borderDash: [6, 6],
      borderWidth: 1,
      xMax: 5,
      xMin: 5,
      xScaleID: "x",
      yMax: 0,
      yMin: 17000,
      yScaleID: "y",
    };

    const annotation2 = {
      type: "line",
      borderColor: "green",
      borderDash: [6, 6],
      borderWidth: 1,
      xMax: 8,
      xMin: 8,
      xScaleID: "x",
      yMax: 0,
      yMin: 17000,
      yScaleID: "y",
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
            },
            min: 14500,
          },
        },
      },
    };

    // visar diagrammet
    const canvas = document.getElementById("canvas");
    const testChart = new Chart(canvas, config);
  });
