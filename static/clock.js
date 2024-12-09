const span = document.getElementById("clock");

function time() {
  let d = new Date();
  let s = d.getSeconds();
  let m = d.getMinutes();
  let h = d.getHours();
  span.textContent =
    ("0" + h).substr(-2) +
    ":" +
    ("0" + m).substr(-2) +
    ":" +
    ("0" + s).substr(-2);
}

setInterval(time, 1000);

document.getElementById("myForm").addEventListener("submit", function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Select the form element
  const form = event.target;

  // Convert form data to a JavaScript object
  const formData = new FormData(form);
  const jsonData = {};

  // Iterate over formData to populate jsonData
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  // Define the URL to send the POST request
  const url = "/s-four/"; // Replace with your API endpoint

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Open a connection to the URL
  xhr.open("POST", url, true);

  // Set the request header to specify the data format
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define a callback function to handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("Response:", JSON.parse(xhr.responseText));
      } else {
        console.error("Error:", xhr.status, xhr.statusText);
      }
    }
  };

  // Send the JSON data
  xhr.send(JSON.stringify(jsonData));
});

function myFunction() {
  const element = document.getElementById("usage");

  // Simulate a click event
  element.click();
}

setInterval(myFunction, 10000); // 5000 milliseconds = 5 seconds
