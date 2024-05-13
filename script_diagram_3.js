const urlSCB =
  " https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI1301/MI1301F/MI1301MPCOICOPN";

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

const request = new Request(urlSCB, {
  method: "POST",
  body: JSON.stringify(querySCB),
});

fetch(request)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // Värden för växthusgaser
    const values = data.data.map((value) => value.values[0]);
    console.log(values);

    // Växthusgaser
    const gases = data.data.map((value) => value.key[1]);
    console.log("Växthusgas", gases);

    // sparar ner årtal som labels
    const labels = data.data.map((value) => value.key[3]);
    console.log("Årtal", labels);

    const values18 = values.slice(0, 3);

    const values19 = values.slice(4, 7);

    const values20 = values.slice(8, 11);

    // const valuesTest = [...new Set(labels)];

    datasets = [
      {
        label: "Växthusgaser 1",
        data: values18,
      },
      {
        label: "Växthusgaser 2",
        data: values19,
      },
      {
        label: "Växthusgaser 3",
        data: values20,
      },
    ];

    const data2 = {
      labels,
      datasets,
    };

    const config = {
      type: "bar",
      data: data2,
      options: {
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    };

    const canvas = document.getElementById("diagram3");
    const chart3 = new Chart(canvas, config);
  });
