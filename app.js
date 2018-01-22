let myChart;
let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let tempScale;

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
    .catch(error => console.log("Something went wrong!", error));
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
 
function getDate(timestamp){
 let date = new Date(timestamp*1000);
 let month = months_arr[date.getMonth()];
 let day = date.getDate();
 return `${day} ${month}`; 
}


function displayWeather(forecast) {
  let ctx = document.getElementById("myChart").getContext("2d");
  let scale = (tempScale === "metric") ? "C" : "F"; 
  if(myChart){
  myChart.destroy();  
  }
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        getDate(forecast.list[0].dt),
        getDate(forecast.list[1].dt),
        getDate(forecast.list[2].dt),
        getDate(forecast.list[3].dt),
        getDate(forecast.list[4].dt),
        getDate(forecast.list[5].dt),
        getDate(forecast.list[6].dt),
      ],
      datasets: [
        {
          label: `${forecast.city.name}, ${forecast.city.country}`,
          data: [
            forecast.list[0].temp.day,
            forecast.list[1].temp.day,
            forecast.list[2].temp.day,
            forecast.list[3].temp.day,
            forecast.list[4].temp.day,
            forecast.list[5].temp.day,
            forecast.list[6].temp.day,
          ],
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

  let averagePressure = 0;  
  for (let i = 0; i < 7; i++) {
    averagePressure = averagePressure + forecast.list[i].pressure;;
  }
  averagePressure = Math.round(averagePressure / 7 * 100) / 100;
  
  document.getElementById("weatherForecast").textContent =
    `The temperature today in  
    ${forecast.city.name}, ${forecast.city.country} 
    is ${forecast.list[0].temp.day}${scale} 
    with a 7-day average pressure of  
    ${averagePressure}hPa.`;
}
