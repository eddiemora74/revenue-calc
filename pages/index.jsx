import Layout from "../components/layout";
import { useState, useEffect } from "react";
import currency from "../utils/currency";
import ExpensesCard from "../components/expenses";
import initialDataPoints from "../utils/initialDataPoints";

export default function Home() {
  const [dataPoints, setDataPoints] = useState(initialDataPoints);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subscriptionCost, setSubscriptionCost] = useState(0.0);
  const [frequency, setFrequency] = useState(1);
  const [baseCost, setBaseCost] = useState(0.0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    sessionStorage.getItem("dataPoints")
      ? setDataPoints(JSON.parse(sessionStorage.getItem("dataPoints")))
      : "";
    sessionStorage.getItem("subscriberCount")
      ? setSubscriberCount(sessionStorage.getItem("subscriberCount"))
      : "";
    sessionStorage.getItem("subscriptionCost")
      ? setSubscriptionCost(sessionStorage.getItem("subscriptionCost"))
      : "";
    sessionStorage.getItem("frequency")
      ? setFrequency(sessionStorage.getItem("frequency"))
      : "";
    sessionStorage.getItem("baseCost")
      ? setBaseCost(sessionStorage.getItem("baseCost"))
      : "";
    sessionStorage.getItem("expenses")
      ? setExpenses(JSON.parse(sessionStorage.getItem("expenses")))
      : "";
  }, []);

  useEffect(() => {
    setBaseCost(subscriptionCost * subscriberCount);
    sessionStorage.setItem("baseCost", subscriptionCost * subscriberCount);
  }, [subscriberCount, subscriptionCost]);

  useEffect(() => {
    const totalExpenses = returnTotalExpenses();
    const pointsCopy = dataPoints.map((point) => {
      point.value =
        baseCost * (point.multiplier / frequency) -
        totalExpenses * (point.multiplier / 365);
      return point;
    });

    setDataPoints(pointsCopy);
    sessionStorage.setItem("dataPoints", JSON.stringify(pointsCopy, null, 4));
  }, [baseCost, frequency, expenses]);

  function addExpense() {
    const newExpense = {
      value: 0,
      frequency: 1,
    };
    setExpenses([...expenses, newExpense]);
    sessionStorage.setItem(
      "expenses",
      JSON.stringify([...expenses, newExpense], null, 4)
    );
  }

  function deleteExpense(index) {
    const expenseCopy = expenses.filter((e) => expenses.indexOf(e) !== index);
    setExpenses(expenseCopy);
    sessionStorage.setItem("expenses", JSON.stringify(expenseCopy, null, 4));
  }

  function updateExpense(index, attribute, value) {
    const expenseCopy = [...expenses];
    expenseCopy[index][attribute] = value;
    setExpenses(expenseCopy);
    sessionStorage.setItem("expenses", JSON.stringify(expenseCopy, null, 4));
  }

  function returnTotalExpenses() {
    if (expenses.length === 0) return 0;
    return expenses
      .map((e) => {
        return e.value * (365 / e.frequency);
      })
      .reduce((a, b) => {
        return a + b;
      });
  }

  function resetAll() {
    setDataPoints(initialDataPoints);
    setSubscriberCount(0);
    setSubscriptionCost(0.0);
    setFrequency(1);
    setBaseCost(0.0);
    setExpenses([]);
    sessionStorage.clear();
  }

  return (
    <Layout>
      <div className="container mt-3">
        <div className="row justify-content-end my-3">
          <button className="btn btn-warning btn-sm mx-3" onClick={resetAll}>
            Clear
          </button>
        </div>
        <div className="card-deck">
          {dataPoints.map((point) => (
            <div className="card text-center" key={point.key}>
              <div className="card-header">{point.title}</div>
              <div className="card-body">
                <span className="revenue-number">
                  {currency(point.value).format()}
                </span>
              </div>
              <div className="card-footer">
                <p className="card-text">
                  <small className="text-muted">
                    {currency(
                      subscriptionCost * (point.multiplier / frequency)
                    ).format()}{" "}
                    per user
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-4 " />
        <div className="row">
          <div className="col-sm-6 mb-3">
            <div className="card">
              <div className="card-header text-center">
                <h5>Subscription Model</h5>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group row">
                    <label
                      htmlFor="subscriber-count"
                      className="col-sm-4 col-form-label"
                    >
                      # of Subscribers
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        id="subscriber-count"
                        placeholder="Enter number..."
                        value={subscriberCount}
                        onChange={(e) => {
                          setSubscriberCount(e.target.value);
                          sessionStorage.setItem(
                            "subscriberCount",
                            e.target.value
                          );
                        }}
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="subscribe-cost"
                      className="col-sm-4 col-form-label"
                    >
                      Subscription Cost
                    </label>
                    <div className="col-sm-8 input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        name="subscribe-cost"
                        id="subscribe-cost"
                        placeholder="Enter cost per user..."
                        value={subscriptionCost}
                        step={0.01}
                        min={0}
                        onChange={(e) => {
                          setSubscriptionCost(e.target.value);
                          sessionStorage.setItem(
                            "subscriptionCost",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="subscribe-frequency"
                      className="col-sm-4 col-sm-label"
                    >
                      Frequency
                    </label>
                    <div className="col-sm-8">
                      <select
                        name="subscribe-frequency"
                        id="subscribe-frequency"
                        className="custom-select"
                        onChange={(e) => {
                          setFrequency(e.target.value);
                          sessionStorage.setItem("frequency", e.target.value);
                        }}
                      >
                        <option defaultValue value={1}>
                          Per day
                        </option>
                        <option value={7}>Per week</option>
                        <option value={30}>Per month (30 days)</option>
                        <option value={365}>Per year (365 days)</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-6 mb-3">
            <ExpensesCard
              fields={expenses}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
              updateExpense={updateExpense}
              totalExpenses={() => returnTotalExpenses()}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
