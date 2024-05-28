// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)

//hitta url
const urlSCB =
  " https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

//info kring diagrammet
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
        values: ["2018", "2019", "2020", "2021"],
      },
    },
  ],
  response: {
    format: "json",
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

    //behandla data
    const labelsRaw = scbData.data.map((data) => data.key[3]);
    console.log(labelsRaw);

    const valuesRaw = scbData.data.map((data) => data.values[0]);
    console.log(valuesRaw);

    const gases = scbData.data.map((value) => value.key[1]);
    console.log("Växthusgas", gases);

    const labels = [...new Set(labelsRaw)];
    console.log(labels);

    const gases2 = [...new Set(gases)];
    console.log(gases2);

    const datasets = [];

    for (let i = 0; i < gases2.length; i++) {
      const data = valuesRaw.splice(0, labels.length);

      const colors = ["#8fbabf","#ffd6e0","#c8ebc2","#e1c6d9","#bebeda","#fbf7b1","#f2d1ae","#ffadad","#aecca3","#C8E3E4","#E4F1F2"];

      console.log(i);

      datasets[i] = {
        label: gases2[i],
        data,
        backgroundColor: colors[i],
        
        // borderRadius: {topLeft: 15, topRight: 15},
        // borderSkipped: 'middle',
      };
    }

    console.log(datasets);

    const data = {
      //labels hämtade från scb på rad 53
      labels,
      datasets,
    };

    console.log(data);

    //charat type line istället för bar
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
            /*  min: 150000,*/
          },
        },

        /*  scales: {
          x: {
            display: true,
          },
          y: {
            display: true,
            type: 'logarithmic',
          }
        }
         */
      },
    };

    //hämtar canvaselement med id scb
    const canvas = document.getElementById("diagram3");
    const testing = new Chart(canvas, config);
  });
