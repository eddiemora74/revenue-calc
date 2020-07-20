import Layout from "../components/layout";
import { useState, useEffect } from "react";
import currency from "../utils/currency";

const dineroOptions = {
  currency: "USD",
  precision: 2,
};

const initialDataPoints = [
  {
    title: "Per Day",
    key: "day",
    value: 0,
    multiplier: (frequency) => 1 / frequency,
  },
  {
    title: "Per Week",
    key: "week",
    value: 0,
    multiplier: (frequency) => 7 / frequency,
  },
  {
    title: "Per Month",
    key: "month",
    value: 0,
    multiplier: (frequency) => 30 / frequency,
  },
  {
    title: "Per Year",
    key: "year",
    value: 0,
    multiplier: (frequency) => 365 / frequency,
  },
];

export default function Home() {
  const [dataPoints, setDataPoints] = useState(initialDataPoints);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subscriptionCost, setSubscriptionCost] = useState(0.0);
  const [frequency, setFrequency] = useState(1);
  const [baseCost, setBaseCost] = useState(0.0);

  useEffect(() => {
    setBaseCost(subscriptionCost * subscriberCount);
  }, [subscriberCount, subscriptionCost]);

  useEffect(() => {
    const pointsCopy = dataPoints.map((point) => {
      point.value = baseCost * point.multiplier(frequency);
      return point;
    });

    setDataPoints(pointsCopy);
  }, [baseCost, frequency]);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card-deck">
          {dataPoints.map((point) => (
            <div className="card" key={point.key}>
              <div className="card-body">
                <h5 className="card-title text-center">{point.title}</h5>
                <h2 className="text-center" style={{ fontFamily: "Monospace" }}>
                  {currency(point.value).format()}
                </h2>
                <p className="card-text text-center">
                  <small className="text-muted">
                    {currency(
                      subscriptionCost * point.multiplier(frequency)
                    ).format()}{" "}
                    per user
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center">Subscriber Model</h3>
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
                        onChange={(e) => setSubscriberCount(e.target.value)}
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
                        onChange={(e) => setSubscriptionCost(e.target.value)}
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
                        onChange={(e) => setFrequency(e.target.value)}
                      >
                        <option selected value={1}>
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
        </div>
      </div>
    </Layout>
  );
}
