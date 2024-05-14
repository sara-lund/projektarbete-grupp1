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
    method: 'POST',
    body: JSON.stringify(querySCB)
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
  console.log(labelsRaw)

  const valuesRaw = scbData.data.map((data) => data.values[0]);
  console.log(valuesRaw)

  const labels = [...new Set(labelsRaw)];
  console.log(labels)

  const dataBorl = valuesRaw.splice(0, labels.length);
  const dataFalun = valuesRaw;

  console.log('borlänge', dataBorl, 'falun: ', dataFalun);

  const datasets = [
    //endast ett dataset
    {
      label: 'blandat',
      //värden hämtade från scb på rad 50
      data: dataBorl,
    },
    {
        label: 'CO2',
        //värden hämtade från scb på rad 50
        data: dataFalun,
      }
  ];

  const data = {
    //labels hämtade från scb på rad 53
    labels,
    datasets
  };

  console.log(data);


  //charat type line istället för bar
  const config = { 
    type: 'bar', 
    data,
    options:{
      scales: {
        x:{
          stacked: true,
        },
        y:{
          stacked: true,
        }
      }
    }
  };


  //hämtar canvaselement med id scb
  const canvas = document.getElementById('scbtest');
  const testing = new Chart(canvas, config);
});