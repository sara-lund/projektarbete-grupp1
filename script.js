const testDataUrl = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/TotaltUtslappN";

const testQuery = {
    "query": [
      {
        "code": "Vaxthusgaser",
        "selection": {
          "filter": "item",
          "values": [
            "CO2-ekv."
          ]
        }
      },
      {
        "code": "Sektor",
        "selection": {
          "filter": "item",
          "values": [
            "4.0"
          ]
        }
      },
      {
        "code": "Tid",
        "selection": {
          "filter": "item",
          "values": [
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022"
          ]
        }
      }
    ],
    "response": {
      "format": "json"
    }
  }

const request = new Request(testDataUrl, {
    method: "POST",
    body: JSON.stringify(testQuery)
});

fetch(request)
.then((response) => response.json())
.then((testData) => {
    // skriver ut en array av info från länken
    console.log(testData)

    // sparar ner utsläpp av växthusgaser som values
    const values = testData.data.map((value) => value.values[0]);
    console.log(values);

    // sparar ner årtal som labels
    const labels = testData.data.map((value) => value.key[2]);
    console.log("Årtal", labels);

    // skapar linjediagram
    const datasets = [{
        label: "Totala växthusgaser",
        data: values
    }];

    const data = {
        labels,
        datasets
    };

    console.log(data);

    const config = {
        type: "line",
        data
    };

    // visar diagrammet
    const canvas = document.getElementById('canvas');
    const testChart = new Chart(canvas, config);
});