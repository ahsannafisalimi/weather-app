import "./app-title.js";
import css from "./app.css";
import axios from "axios";
import images from "./importAllImages.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-term");
const msg = document.querySelector(".form-msg");
const list = document.querySelector(".cities");

const apiKey = "373a8aa3d61509e01798c35a074f5772";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  msg.textContent = "";
  msg.classList.remove("visible");

  let inputVal = input.value;

  const listItemsArray = Array.from(list.querySelectorAll(".cities li"));

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      let cityName = el.querySelector(".city-name").textContent.toLowerCase();
      let cityCountry = el
        .querySelector(".city-country")
        .textContent.toLowerCase();

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];

          content = cityName;
        } else {
          content = `${cityName},${cityCountry}`;
        }
      } else {
        content = cityName;
      }

      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `Anda telah mengetahui cuaca untuk kota/wilayah ${
        filteredArray[0].querySelector(".city-name").textContent
      }. Untuk lebih spesifik, Anda dapat menambahkan kode negara dibelakangnya (Misal: Jakarta,ID)`;

      msg.classList.add("visible");

      form.reset();
      input.focus();

      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const { main, name, sys, weather } = data;

      const icon = images[`${weather[0]["icon"]}.png`];
      const flag = images[`${sys.country}.svg`];
      const li = document.createElement("li");

      const markup = `
      	<figure>
          <img src="${icon}" alt="${weather[0]["description"]}" />
        </figure>
        <div>
          <h3>
            <span class="city-name">${name}</span><span class="city-country"><img src="${flag}" alt="${
        sys.country
      }"/></span>
          </h3>
          <h2>${Math.round(main.temp)}<sup>°C</sup></h2>
          <p class="city-conditions">${weather[0][
            "description"
          ].toUpperCase()}</p>
        </div>
      `;

      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      msg.textContent =
        "Gagal mengambil data cuaca. Pastikan nama kota atau wilayah yang Anda masukkan benar dan menggunakan format yang benar ('namakota' atau 'namakota,kodenegara'. Misal: Jakarta,ID)";
      msg.classList.add("visible");
    });

  msg.textContent = "";

  form.reset();
  input.focus();
});
