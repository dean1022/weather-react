import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "Toronto",
      current: null,
      forecast: [],
      query: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchCurrent = this.fetchCurrent.bind(this);
    this.applyCurrent = this.applyCurrent.bind(this);
    this.fetchForecast = this.fetchForecast.bind(this);
  }

  componentDidMount() {
    this.fetchCurrent(this.state.city);
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    var raw = this.state.query || "";
    var lower = raw.toLowerCase();
    var city = lower.charAt(0).toUpperCase() + lower.slice(1);
    if (!city) return;
    this.fetchCurrent(city);
  }

  fetchCurrent(city) {
    // simple API URL with key in code, no fetch
    var apiKey = "14b3e71od6df40977d863a00tdaeb6ef";
    var url =
      "https://api.shecodes.io/weather/v1/current?query=" +
      city +
      "&key=" +
      apiKey;

    var self = this;
    axios.get(url).then(function (res) {
      self.applyCurrent(res.data);
      self.fetchForecast(res.data.city);
    });
  }

  applyCurrent(data) {
    // keep only the fields we show
    this.setState({
      city: data.city,
      current: {
        temp: Math.round(data.temperature.current),
        feels_like: Math.round(data.temperature.feels_like),
        pressure: data.temperature.pressure,
        humidity: data.temperature.humidity,
        wind: data.wind && data.wind.speed,
        description: data.condition && data.condition.description,
        icon_url: data.condition && data.condition.icon_url,
      },
    });
  }

  fetchForecast(city) {
    var apiKey = "14b3e71od6df40977d863a00tdaeb6ef";
    var url =
      "https://api.shecodes.io/weather/v1/forecast?query=" +
      city +
      "&key=" +
      apiKey;
    var self = this;
    axios.get(url).then(function (res) {
      // use response.data for forecast
      var days = (res.data && res.data.daily) || [];
      // only first 5
      var firstFive = days.slice(0, 5);
      self.setState({ forecast: firstFive });
    });
  }

  formatDay(ts) {
    var d = new Date(ts * 1000);
    var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[d.getDay()];
  }

  renderHeader() {
    var now = new Date();
    var dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var day = dayNames[now.getDay()];
    var hrs = now.getHours();
    var mins = now.getMinutes();
    var mm = mins < 10 ? "0" + mins : mins;

    return (
      <div className="text-end">
        <div className="h4 fw-semibold">{this.state.city || "Weather"}</div>
        <div>{day + " " + hrs + ":" + mm}</div>
        <div className="text-capitalize">
          {this.state.current && this.state.current.description}
        </div>
      </div>
    );
  }

  renderCurrent() {
    if (!this.state.current) return null;
    var c = this.state.current;

    return (
      <div className="row g-3 align-items-center">
        <div className="col-auto" style={{ fontSize: 56 }}>
          {c.icon_url ? <img src={c.icon_url} alt="icon" /> : "☁️"}
        </div>
        <div className="col-auto fw-semibold" style={{ fontSize: 56 }}>
          <span>{c.temp}</span>
          <sup>°C</sup>
        </div>
        <div className="col">
          <div>Feels Like: {c.feels_like}°C</div>
          <div>Pressure: {c.pressure}</div>
          <div>Humidity: {c.humidity}%</div>
          <div>Wind: {c.wind} mph</div>
        </div>
        <div className="col">{this.renderHeader()}</div>
      </div>
    );
  }

  renderForecast() {
    var list = this.state.forecast || [];
    if (!list.length) return null;

    return (
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3 mt-3">
        {list.map((d, i) => (
          <div className="col" key={i}>
            <div className="card h-100 text-center border-2">
              <div className="card-body p-2">
                <div className="fw-semibold">{this.formatDay(d.time)}</div>
                <div className="my-2">
                  <img src={d.condition && d.condition.icon_url} alt="icon" />
                </div>
                <div>
                  <strong>
                    {Math.round(d.temperature && d.temperature.maximum)}°
                  </strong>
                  <span className="ms-1">
                    {Math.round(d.temperature && d.temperature.minimum)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-2 shadow-sm">
              <div className="card-body">
                <form className="mb-3" onSubmit={this.handleSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={this.state.query}
                      onChange={this.handleChange}
                      placeholder="Enter City"
                      className="form-control"
                    />
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>

                {this.renderCurrent()}

                {this.renderForecast()}
              </div>
              <div className="card-footer small text-center">
                Coded by{" "}
                <a
                  href="https://www.linkedin.com/in/dean-voss/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dean Voss (Lasini Kurukulasooriya)
                </a>
                . Code on{" "}
                <a
                  href="https://github.com/dean1022/weather-react"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                . Hosted on{" "}
                <a
                  href="https://dean-weather-react.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Netlify
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
