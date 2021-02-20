import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import { useState } from "react";
import monthConvert from "../utils/monthConvert";
import Chart from "react-google-charts";

export default function LoanPayoffCalc() {
  const [balance, setBalance] = useState();
  const [interestRate, setInterestRate] = useState();
  const [minimumPayment, setMinimumPayment] = useState();
  const [extraPayment, setExtraPayment] = useState();
  const [dataTable, setDataTable] = useState();
  const [dataTableNoExtra, setDataTableNoExtra] = useState();
  const [totalInterestPaid, setTotalInterestPaid] = useState();
  const [totalInterestPaidNoExtra, setTotalInterestPaidNoExtra] = useState();
  const [activeTab, setActiveTab] = useState("noextra");

  function DataChart() {
    let data = [];
    if (dataTable) {
      dataTableNoExtra.forEach((i) =>
        data.push([
          new Date(i.rawPaymentDate.getFullYear(), i.rawPaymentDate.getMonth()),
          i.rawBalance,
          0,
        ])
      );
      dataTable.forEach((i, idx) => (data[idx][2] = i.rawBalance));
      data = [
        [
          { type: "date", label: "Payment Date" },
          "Balance",
          "Balance (w/ Extra)",
        ],
        ...data,
      ];
    } else {
      dataTableNoExtra.forEach((i) =>
        data.push([
          new Date(i.rawPaymentDate.getFullYear(), i.rawPaymentDate.getMonth()),
          0,
        ])
      );
      data = [[{ type: "date", label: "Payment Date" }, "Balance"], ...data];
    }

    const options = {
      title: "Balance Burn-down",
      hAxis: { title: "Months" },
      vAxis: { title: "Dollars", format: "currency" },
    };
    return (
      <Chart
        width={"100%"}
        height={"500px"}
        chartType="LineChart"
        loader={<div>Loading...</div>}
        data={data}
        options={options}
      />
    );
  }

  const usCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function calculatePayoff() {
    if (extraPayment) {
      let currentBalance = balance;
      let currentBalanceNoExtra = balance;
      let paymentDate = new Date();
      let paymentDateNoExtra = new Date();
      let extra = extraPayment;
      let totalInterest = 0;
      let totalInterestNoExtra = 0;
      const amoritizedInterest = interestRate / 100 / 12;
      let workingTable = [];
      let workingTableNoExtra = [];

      while (currentBalance > 0) {
        const interestPaid = currentBalance * amoritizedInterest;
        let principal = minimumPayment - interestPaid;
        principal =
          principal > currentBalance
            ? principal - (principal - currentBalance)
            : principal;
        currentBalance -= principal;

        extra =
          extra > currentBalance ? extra - (extra - currentBalance) : extra;
        currentBalance -= extra;

        totalInterest += interestPaid;
        workingTable.push({
          payDate: `${monthConvert(
            paymentDate.getMonth()
          )} ${paymentDate.getFullYear()}`,
          principal: usCurrency.format(principal),
          extra: extra ? usCurrency.format(extra) : null,
          interest: usCurrency.format(interestPaid),
          totalInterest: usCurrency.format(totalInterest),
          balance: usCurrency.format(currentBalance),
          rawTotalInterest: totalInterest,
          rawBalance: currentBalance,
          rawPrincipal: principal,
          rawInterest: interestPaid,
          rawPaymentDate: new Date(paymentDate),
        });
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }

      while (currentBalanceNoExtra > 0) {
        const interestPaid = currentBalanceNoExtra * amoritizedInterest;
        let principal = minimumPayment - interestPaid;
        principal =
          principal > currentBalanceNoExtra
            ? principal - (principal - currentBalanceNoExtra)
            : principal;
        currentBalanceNoExtra -= principal;

        totalInterestNoExtra += interestPaid;
        workingTableNoExtra.push({
          payDate: `${monthConvert(
            paymentDateNoExtra.getMonth()
          )} ${paymentDateNoExtra.getFullYear()}`,
          principal: usCurrency.format(principal),
          extra: null,
          interest: usCurrency.format(interestPaid),
          totalInterest: usCurrency.format(totalInterestNoExtra),
          balance: usCurrency.format(currentBalanceNoExtra),
          rawTotalInterest: totalInterestNoExtra,
          rawBalance: currentBalanceNoExtra,
          rawPrincipal: principal,
          rawInterest: interestPaid,
          rawPaymentDate: new Date(paymentDateNoExtra),
        });
        paymentDateNoExtra.setMonth(paymentDateNoExtra.getMonth() + 1);
      }

      setDataTable(workingTable);
      setDataTableNoExtra(workingTableNoExtra);
      setTotalInterestPaid(totalInterest);
      setTotalInterestPaidNoExtra(totalInterestNoExtra);
    } else {
      let currentBalanceNoExtra = balance;
      let paymentDateNoExtra = new Date();
      let totalInterestNoExtra = 0;
      const amoritizedInterest = interestRate / 100 / 12;
      let workingTableNoExtra = [];

      while (currentBalanceNoExtra > 0) {
        const interestPaid = currentBalanceNoExtra * amoritizedInterest;
        let principal = minimumPayment - interestPaid;
        principal =
          principal > currentBalanceNoExtra
            ? principal - (principal - currentBalanceNoExtra)
            : principal;
        currentBalanceNoExtra -= principal;

        totalInterestNoExtra += interestPaid;
        workingTableNoExtra.push({
          payDate: `${monthConvert(
            paymentDateNoExtra.getMonth()
          )} ${paymentDateNoExtra.getFullYear()}`,
          principal: usCurrency.format(principal),
          extra: null,
          interest: usCurrency.format(interestPaid),
          totalInterest: usCurrency.format(totalInterestNoExtra),
          balance: usCurrency.format(currentBalanceNoExtra),
          rawTotalInterest: totalInterestNoExtra,
          rawBalance: currentBalanceNoExtra,
          rawPrincipal: principal,
          rawInterest: interestPaid,
          rawPaymentDate: new Date(paymentDateNoExtra),
        });
        paymentDateNoExtra.setMonth(paymentDateNoExtra.getMonth() + 1);
      }

      setDataTable();
      setDataTableNoExtra(workingTableNoExtra);
      setTotalInterestPaid(0);
      setTotalInterestPaidNoExtra(totalInterestNoExtra);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Loan Payoff Calculator</title>
      </Head>
      <div className="container">
        <h1 className="display-4 my-3">Loan Payoff Calculator</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="input-group px-2">
            <div className="input-group-prepend">
              <span className="input-group-text">$</span>
            </div>
            <input
              className="form-control"
              type="number"
              placeholder="Loan Balance"
              defaultValue={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
          <div className="input-group px-2">
            <input
              className="form-control"
              type="number"
              placeholder="Interest Rate"
              defaultValue={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <div className="input-group-append">
              <span className="input-group-text">%</span>
            </div>
          </div>
          <div className="input-group px-2">
            <div className="input-group-prepend">
              <span className="input-group-text">$</span>
            </div>
            <input
              className="form-control"
              type="number"
              placeholder="Minimum Payment"
              defaultValue={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
            />
          </div>
          <div className="input-group px-2">
            <div className="input-group-prepend">
              <span className="input-group-text">$</span>
            </div>
            <input
              className="form-control"
              type="number"
              placeholder="Extra Payment"
              defaultValue={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={calculatePayoff}>
            Calculate
          </button>
        </div>
      </div>
      {dataTableNoExtra && (
        <div className="container">
          <div className="card-deck mt-3">
            <div className="card text-center">
              <div className="card-header">Number of Payments</div>
              <div className="card-body">
                <span className="revenue-number">
                  {dataTableNoExtra.length}
                </span>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-header">Est. Payoff Date</div>
              <div className="card-body">
                <span className="revenue-number">
                  {dataTableNoExtra[dataTableNoExtra.length - 1].payDate}
                </span>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-header">Interest Paid</div>
              <div className="card-body">
                <span className="revenue-number">
                  {usCurrency.format(totalInterestPaidNoExtra)}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="table-data" className="my-3 w-50">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <span
                    className={
                      activeTab === "noextra" ? "nav-link active" : "nav-link"
                    }
                    id="nav-noextra-tab"
                    onClick={() => setActiveTab("noextra")}
                    style={{ cursor: "pointer" }}
                  >
                    Regular
                  </span>
                  {dataTable ? (
                    <span
                      className={
                        activeTab === "extra" ? "nav-link active" : "nav-link"
                      }
                      id="nav-extra-tab"
                      onClick={() => setActiveTab("extra")}
                      style={{ cursor: "pointer" }}
                    >
                      With Extra Payment
                    </span>
                  ) : (
                    <span className="nav-link disabled-tab" id="nav-extra-tab">
                      With Extra Payment
                    </span>
                  )}
                </div>
              </nav>
              <div
                className="tab-content"
                id="nav-tabContent"
                style={{ height: "450px", overflowY: "auto" }}
              >
                <div
                  className={
                    activeTab === "noextra"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="nav-noextra"
                >
                  <table className="table table-sm bg-white ubuntu-font">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Payment Date</th>
                        <th scope="col">Principal</th>
                        <th scope="col">Interest</th>
                        <th scope="col">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTableNoExtra &&
                        dataTableNoExtra.map((row, idx) => {
                          return (
                            <tr key={idx}>
                              <td scope="row">{row.payDate}</td>
                              <td>
                                {row.principal}
                                {row.extra && (
                                  <span style={{ marginLeft: "10px" }}>
                                    (+{row.extra})
                                  </span>
                                )}
                              </td>
                              <td>{row.interest}</td>
                              <td>{row.balance}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={
                    activeTab === "extra"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="nav-extra"
                >
                  <table className="table table-sm bg-white ubuntu-font">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Payment Date</th>
                        <th scope="col">Principal</th>
                        <th scope="col">Interest</th>
                        <th scope="col">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTable &&
                        dataTable.map((row, idx) => {
                          return (
                            <tr key={idx}>
                              <td scope="row">{row.payDate}</td>
                              <td>
                                {row.principal}
                                {row.extra && (
                                  <span style={{ marginLeft: "10px" }}>
                                    (+{row.extra})
                                  </span>
                                )}
                              </td>
                              <td>{row.interest}</td>
                              <td>{row.balance}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="div my-3 w-50">
              {dataTableNoExtra && <DataChart />}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
