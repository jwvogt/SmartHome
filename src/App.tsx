import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { notification } from "antd";
import SmileOutlined from "@ant-design/icons/lib/icons/SmileOutlined";

import NavMenu from "./Components/NavMenu";
import { Dashboard } from "./Pages/Dashboard";
import Metrics from "./Pages/Metrics";
import Sensors from "./Pages/Sensors";
import { devURL, updateRecord } from "./common";

const App = () => {
  const [apps, setApps] = useState([]);
  const [doorsWindows, setDoorsWindows] = useState([]);
  const [therm, setTherm] = useState({});
  const [sims, setSims] = useState({});

  useEffect(() => {
    getAppData();
    fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((data) => {
        var newQuote = data[Math.floor(Math.random() * data.length)];
        notification.open({
          message: "Quote of the Day",
          icon: <SmileOutlined />,
          description: newQuote.text,
          placement: "bottomRight",
          duration: 6,
        });
      });

    return () => {
      setApps([]);
      setDoorsWindows([]);
      setTherm({});
    };
  }, []);

  useEffect(() => {
    updateRecord("thermostat", therm);
  }, [therm]);

  const getAppData = () => {
    fetch(`${devURL}/api/get/sensors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((json) => {
        if (json) {
          setApps(json.appliances);
          setDoorsWindows(json.doors_and_windows);
          setTherm({
            outsideTemp: json.thermostat.outsideTemp,
            insideTemp: json.thermostat.insideTemp,
            temp: json.thermostat.temp,
          });
        }
      });

    fetch(`${devURL}/api/get/sims`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((json) => {
        if (json) {
          setSims(json);
        }
      });
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                apps={apps}
                doorsAndWindows={doorsWindows}
                therm={therm}
                setApps={setApps}
                setDoorsAndWindows={setDoorsWindows}
                setTherm={setTherm}
              />
            }
          />
          <Route path="/metrics" element={<Metrics />} />
          <Route
            path="/sensors"
            element={
              <Sensors
                apps={apps}
                doorsAndWindows={doorsWindows}
                sims={sims}
                setApps={setApps}
                setDoorsAndWindows={setDoorsWindows}
                setSims={setSims}
              />
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="" element={<Navigate to="/dashboard" />} />
        </Routes>
        <NavMenu />
      </BrowserRouter>
    </>
  );
};

export default App;
