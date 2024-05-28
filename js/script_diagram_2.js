// Grupp 1: Alva Sundberg (h20alsun), Sara Lundequist (h22sarlu)
const urlSCB2 =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

querySCB2 = {
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

const request2 = new Request(urlSCB2, {
  method: "POST",
  body: JSON.stringify(querySCB2),
});

fetch(request2)
  .then((response2) => response2.json())
  .then((SCBdata2) => {
    console.log(SCBdata2);

    // Hämta ut årtalen
    const labelsRaw2 = SCBdata2.data.map((label2) => label2.key[3]);

    // Kombinerar dubletter av årtal till ett enda årtal
    const labels2 = [...new Set(labelsRaw2)];
    console.log("Årtal", labels2);

    const valuesRaw2 = SCBdata2.data.map((value2) => value2.values[0]);
    console.log("Råa värden", valuesRaw2);

    const sumYear2 = [...new Set(labelsRaw2)];
    console.log(sumYear2);

    // tom array att använda för summan
    let summa_2 = [];
    let summa2_2 = [];

    // summa för varje år tilldelas värde 0
    labels2.forEach((label2) => {
      summa_2[label2] = 0;
      summa2_2[label2] = 0;
    });
    console.log(summa_2);

    // referens: https://stackoverflow.com/questions/74712508/javascript-sum-of-two-numbers-inside-an-array-print-index-of-numbers-whoose-sum
    // och: https://www.w3schools.com/jsref/jsref_parsefloat.asp

    // loop för att summera mängd/år
    for (let i = 0; i < SCBdata2.data.length; i++) {
      const label2 = SCBdata2.data[i].key[3];
      const value2 = parseFloat(SCBdata2.data[i].values[0]);

      // summan för varje år, label, sparas ner
      summa_2[label2] += value2;

      if (SCBdata2.data[i].key[2] === "4") {
        const label2 = SCBdata2.data[i].key[3];
        const value2 = parseFloat(SCBdata2.data[i].values[0]);

        // summan för varje år, label, sparas ner
        summa2_2[label2] += value2;
      }
    }
    console.log("Summa för respektive år: ", summa_2);
    console.log("Summa (kläder & skor) för respektive år: ", summa2_2);

    // Skapar en array med värden och årtal
    const values_2 = sumYear2.map((label2) => summa_2[label2]);
    const values2_2 = sumYear2.map((label2) => summa2_2[label2]);
    console.log(values_2);

    const datasets2 = [
      {
        label: "Utsläpp kläder/skor",
        data: values2_2,
        fill: "origin",
        backgroundColor: "#745d42e1",
        tension: 0.4,
      },
      {
        label: "Total utsläpp",
        data: values_2,
        fill: "origin",
        backgroundColor: "#79c7b74a",
        tension: 0.4,
      },
    ];

    console.log(datasets2);

    const data2 = {
      labels: labels2,
      datasets: datasets2,
    };

    console.log(data2);

    const config2 = {
      type: "line",
      data: data2,
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: "Ton",
            },
          },
        },
      },
    };

    //hämtar canvaselement med id diagram 2
    const canvas2 = document.getElementById("diagram2");
    const testing = new Chart(canvas2, config2);
  });
