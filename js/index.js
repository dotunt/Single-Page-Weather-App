let tempScale;
const myChart = (() => {
  let chart;
  const get = (ctx, options) => {
    if (chart) chart.destroy();
    chart = new Chart(ctx, options);
    return chart;
  };
  return get;
})();
const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const arr_map = [0,1,2,3,4,5,6];
const options = { weekday: "short", month: "short", day: "numeric" };
const dateTimeFormat = new Intl.DateTimeFormat("en-CA-u-ca-iso8601", options);


function requestWeather() {
  const form = document.forms.weatherForm;
  const cityName = form.elements.cityName.value;
  tempScale = form.elements.scale.value;
  const apiURL =
    "https://api.openweathermap.org/data/2.5/forecast/daily?q=" +
    cityName +
    "&units=" +
    tempScale +
    "&appid=0e48a956800e3f3a3d05996495285f5b";
  fetch(apiURL)
    .then(checkData)
    .then(displayWeather)
    .catch(error => console.error("Something went wrong!", error));
}

function checkData(response) {
  if (response.ok) {
    return response.json();
  } else {
    alert(
      "Could not request the weather: " +
        response.status +
        ": " +
        response.statusText
    );
    throw new Error(response.statusText);
  }
}

function displayWeather(forecast) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const scale = (tempScale === "metric") ? "C" : "F"; 
  const pressures = Array.from(arr_map, index => forecast.list[index].pressure);
  const avgPressure = Math.round(pressures.reduce((total,num) => total + num, 0) / 7 * 100) / 100;
  myChart(ctx, {
    type: "line",
    data: {
      labels: Array.from(arr_map,index => dateTimeFormat.format(forecast.list[index].dt * 1000)),
      datasets: [
        {
          label: `${forecast.city.name}, ${forecast.city.country}`,
          data: Array.from(arr_map, index => forecast.list[index].temp.day),
          borderColor: ["rgba(54, 162, 235, 1)"],
          fill: false,
          borderWidth: 1
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: `Temperature (${scale})`
            },
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Days"
            }
          }
        ]
      }
    }
  });
  
  
  document.getElementById("weatherForecast").textContent =
    `The temperature today in  
    ${forecast.city.name}, ${forecast.city.country} 
    is ${forecast.list[0].temp.day}${scale} 
    with a 7-day average pressure of  
    ${avgPressure}hPa.`;
}
