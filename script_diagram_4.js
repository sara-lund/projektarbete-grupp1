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

    const values61Im = valuesImport.splice(0, 4);
    console.log(values61Im);

    const values61Ex = valuesImport.splice(0, 4);
    console.log(values61Ex);

    // https://stackoverflow.com/questions/24094466/sum-two-arrays-in-single-iteration

    const values = values61Im.map((value, i) => {
      const sum = Number(value) + Number(values61Ex[i]);
      return sum;
    });

    console.log(values);

    console.log(values.toString());

    // const data = valuesRaw.splice(0, labels.length);

    const datasets = [{ label: "Export", data: values61Ex }];

    console.log(datasets);

    const data = {
      //labels hämtade från scb på rad 53
      labels,
      datasets,
    };

    console.log(data);

    //charat type line istället för bar
    const config = {
      type: "polarArea",
      data: data,
      options: {
        responsive: true,
        scale: {
          suggestedMax: 90000,
        },
      },
    };

    //hämtar canvaselement med id scb
    const canvas = document.getElementById("diagram4.1");
    const testing = new Chart(canvas, config);
  });
