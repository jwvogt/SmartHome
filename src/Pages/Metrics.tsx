import { useEffect, useState } from "react";
import moment from "moment";
import { devURL } from "../common";

import LineGraph from "../Components/LineGraph";
import Overview from "../Components/Overview";
import BudgetModal from "../Components/BudgetModal";

const Metrics = () => {
  const [utilData, setUtilData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [month, setMonth] = useState("current");
  const [overviewData, setOverviewData] = useState({});
  const [predictionData, setPredictionData] = useState({});

  const [budget, setBudget] = useState(250);
  const [showBudget, setShowBudget] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => {
    fetch(`${devURL}/api/get/util-usage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((json) => {
        setUtilData(json);
      });

    return () => {
      setUtilData([]);
    };
  }, []);

  useEffect(() => {
    getGraphData();
  }, [month, utilData]);

  useEffect(() => {
    if (month === "current") {
      setOverviewData(calculateTotals());
      setPredictionData(calculateTotals(true));
    } else {
      setOverviewData(calculateTotals());
      setPredictionData({});
    }
  }, [graphData]);

  useEffect(() => {
    displayBudget(graphData);
  }, [budget, showBudget]);

  const getGraphData = () => {
    if (month === "current") {
      var thisMonth = utilData?.filter((day) => {
        return (
          moment(day.date).month() === moment().month() &&
          moment(day.date).date() <= moment().date()
        );
      });
      // TODO: maybe do prediction better (currently using last month's data as prediction)
      var prediction = utilData
        ?.filter((day) => {
          return (
            moment(day.date).month() === moment().month() - 1 &&
            moment(day.date).date() > moment().date() &&
            moment(day.date).date() <= moment().daysInMonth()
          );
        })
        .map((day) => {
          const date: moment.Moment = moment(day.date);
          var datestring = `${date.year()}-${date.month() + 2}-${date.date()}`;

          return {
            ...day,
            date: datestring,
            category: `${day.category} prediction`,
          };
        });

      if (thisMonth && prediction) displayBudget([...thisMonth, ...prediction]);
    } else if (month === "1month") {
      var lastMonth = utilData?.filter((day) => {
        return moment(day.date).month() === moment().month() - 1;
      });
      if (lastMonth) displayBudget(lastMonth);
    } else {
      var monthBeforeLast = utilData?.filter((day) => {
        return moment(day.date).month() === moment().month() - 2;
      });
      if (monthBeforeLast) displayBudget(monthBeforeLast);
    }
  };

  const displayBudget = (graphData) => {
    const newData = [...graphData].filter((day) => {
      return day.category !== "daily budget";
    });

    if (showBudget) {
      const daysInMonth = moment().daysInMonth();
      const dailyCost = budget / daysInMonth;
      let budgetData = graphData.map((day) => {
        return {
          date: day.date,
          cost: dailyCost
            .toString()
            .slice(0, dailyCost.toString().indexOf(".") + 3),
          category: "daily budget",
        };
      });
      setGraphData([...newData, ...budgetData]);
    } else {
      setGraphData(newData);
    }
  };

  const calculateTotals = (isPrediction: boolean = false) => {
    const data = isPrediction
      ? graphData.filter((day) => {
          return day.category?.includes("prediction");
        })
      : graphData.filter((day) => {
          return !day.category?.includes("prediction");
        });

    const powerUsage = data?.filter((day) => {
      return day.category === (isPrediction ? "power prediction" : "power");
    });
    const waterUsage = data?.filter((day) => {
      return day.category === (isPrediction ? "water prediction" : "water");
    });
    var powerTotal = {
      amount: 0,
      cost: 0,
    };
    var waterTotal = {
      amount: 0,
      cost: 0,
    };

    powerTotal = powerUsage?.reduce((prev, curr) => {
      return {
        amount: (prev.amount += curr.amount),
        cost: (prev.cost += curr.cost),
      };
    }, powerTotal);
    waterTotal = waterUsage?.reduce((prev, curr) => {
      return {
        amount: (prev.amount += curr.amount),
        cost: (prev.cost += curr.cost),
      };
    }, waterTotal);

    return {
      water: {
        amount: Math.round(waterTotal.amount),
        cost: Math.round(waterTotal.cost),
      },
      power: {
        amount: Math.round(powerTotal.amount / 1000),
        cost: Math.round(powerTotal.cost),
      },
      cost: Math.round(waterTotal.cost + powerTotal.cost),
    };
  };

  return (
    <>
      <BudgetModal
        budget={budget}
        showBudget={showBudget}
        showModal={showBudgetModal}
        setBudget={setBudget}
        setShowBudget={setShowBudget}
        setShowModal={setShowBudgetModal}
      />
      <LineGraph graphData={graphData} month={month} setMonth={setMonth} />
      <Overview data={overviewData} predictionData={predictionData} />
    </>
  );
};

export default Metrics;
