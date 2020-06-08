/* Global Variables */


// Create a new date instance dynamically with JS
let d = new Date();
// Since month is zero based I added one to it
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Helper functions
const constructURL = (zip) => {
  const baseURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=';
  const apiKey = '[Enter your openweathermap API key here]';
  const zipPart = '&q=' + zip + ',us';
  const units = '&units=imperial'
  return baseURL + apiKey + zipPart + units;
};

const clearInputsHelper = () => {
  const zip = document.getElementById('zip');
  const feelings = document.getElementById('feelings');
  zip.value = "";
  feelings.value = "";
}

const showLatest = (entries) => {
    clearInputsHelper();
    lastEntry = entries.data.pop();
    dateDiv = document.getElementById('date');
    tempDiv = document.getElementById('temp');
    contentDiv = document.getElementById('content');
    dateDiv.innerHTML = `<p>Date: ${lastEntry.date}</p>`;
    tempDiv.innerHTML = `<p>Temp: ${lastEntry.temp}</p>`;
    contentDiv.innerHTML = `<p>Feelings: ${lastEntry.feelings}</p>`;
}

// Async post and get functions
const weatherData = async (url = '') => {
  const request = await fetch(url);
  try {
    const data = await request.json();
    return data;
  }
  catch(error) {
    console.log('error', error);
  }
};

const appData = async (url = '') => {
  const request = await fetch(url);
  try {
    const data = await request.json();
    showLatest(data);
    return data;
  }
  catch(error) {
    console.log("error", error);
  }
};

const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  }
  catch(error) {
    console.log('error', error);
  }
};

// Bring everything together when generate is clicked

const postEntry = () => {
  const zip = document.getElementById('zip').value;
  if (!zip) return;
  const feelings = document.getElementById('feelings').value;
  weatherData(constructURL(zip))
    .then(function(data) {
      postData('/entry', {
        date: newDate,
        feelings: feelings,
        temp: data.main.temp})
    .then(appData('/all'))
  })
}

document.getElementById('generate').addEventListener('click', postEntry)