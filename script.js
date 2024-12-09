const apiKey = "28f03a7d662e4eaf58f85448481bd955" // Replace with OpenWeather API Key
const serverUrl = "http://localhost:3000" // URL of your server for SMS functionality

async function getWeather() {
  const city = document.getElementById("city").value
  if (!city) {
    alert("Please enter a city name")
    return
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.cod === 200) {
      const weatherStatus = `Weather in ${data.name}: ${data.weather[0].description}, Temp: ${data.main.temp}°C`
      document.getElementById("weather-status").innerText = weatherStatus
    } else {
      alert("City not found. Please try again.")
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    alert("An error occurred. Please try again.")
  }
}

// Submit phone number for notifications
document
  .getElementById("notification-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault()
    const phone = document.getElementById("user-phone").value
    const city = document.getElementById("city").value

    if (!city) {
      alert("Please get the weather for a city first.")
      return
    }

    try {
      const response = await fetch(`${serverUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, city }),
      })

      const result = await response.json()
      if (response.ok) {
        document.getElementById("notification-status").innerText =
          `Subscribed to daily weather updates for ${city}`
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error("Error subscribing for notifications:", error)
      alert("An error occurred. Please try again.")
    }
  })
