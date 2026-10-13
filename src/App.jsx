import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [Weather, setWeather] = useState(null);
  const [City, setCity] = useState("");
  const [Place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = City.trim();
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        { params: { q: query, limit: 1, appid: API_KEY } },
      );
      if (geoRes.data.length === 0) {
        setWeather(null);
        setError("ქალაქი ვერ მოიძებნა");
        return;
      }
      const { lat, lon, name, country } = geoRes.data[0];
      const weatherRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        { params: { lat, lon, units: "metric", appid: API_KEY } },
      );

      setPlace(`${name}, ${country}`);
      setWeather(weatherRes.data);
    } catch (error) {
      setWeather(null);
      setError("შეცდომა მონაცემების მიღებისას");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app">
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="ქალაქი"
          value={City}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          ძებნა...
        </button>
      </form>

      {loading && <p>იტვირთება...</p>}
      {error && <p className="error">{error}</p>}

      {Weather && !loading && (
        <>
          <section className="main">
            <h1>{Place}</h1>
            <p className="temp">{Math.round(Weather.main.temp)}°C</p>
            <p className="desc">{Weather.weather[0].description}</p>
          </section>

          <section className="cards">
            <div className="card">
              <span>Feels like</span>
              <strong>{Math.round(Weather.main.feels_like)}°C</strong>
            </div>
            <div className="card">
              <span>Humidity</span>
              <strong>{Weather.main.humidity}%</strong>
            </div>
            <div className="card">
              <span>Wind speed</span>
              <strong>{Weather.wind.speed} m/s</strong>
            </div>
            <div className="card">
              <span>Visibility</span>
              <strong>{(Weather.visibility / 1000).toFixed(1)} km</strong>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
