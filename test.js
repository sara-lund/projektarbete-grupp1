//hitta url
const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

//formatera förfrågan såsom mottagar-API:et vill ha det
const querySCB = {
    query: [
      {
        code: 'Region',
        selection: {
          filter: 'vs:RegionKommun07',
          values: ['2081', '2080']
        }
      },
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['BE0101N1']
        }
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: ['2020', '2021', '2022', '2023']
        }
      }
    ],
    response: {
      format: 'JSON'
    }
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
  const labelsRaw = scbData.data.map((data) => data.key[1]);
  console.log(labelsRaw)

  const valuesRaw = scbData.data.map((data) => data.values[0]);
  console.log(valuesRaw)

  const labels = [...new Set(labelsRaw)];
  console.log(labels)

  const dataBorl = valuesRaw.splice(0, labels.length);
  const dataFalun = valuesRaw;

  console.log('borlänge', dataBorl, 'falun: ', dataFalun);

/* 
  //formatera data som chart.js vill ha det
  const values = scbData.data.map((value) => value.values[0]);
  console.log('värden:', values);

  const labels = scbData.data.map((value) => value.key[1]);
  console.log('etiketter', labels); */
  //lägg in i diagram

  const datasets = [
    //endast ett dataset
    {
      label: 'Befolkning Borlänge',
      //värden hämtade från scb på rad 50
      data: dataBorl,
      fill: false,
    },
    {
        label: 'Befolkning Falun',
        //värden hämtade från scb på rad 50
        data: dataFalun,
        fill: false,
      }
  ];

  const data = {
    //labels hämtade från scb på rad 53
    labels,
    datasets
  };

  console.log(data);


  //charat type line istället för bar
  const config = { type: 'line', data};


  //hämtar canvaselement med id scb
  const canvas = document.getElementById('scbtest');
  const testing = new Chart(canvas, config);
});