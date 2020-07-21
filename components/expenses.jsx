import currency from "../utils/currency";

export default function ExpensesCard({
  fields,
  addExpense,
  deleteExpense,
  updateExpense,
  totalExpenses,
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="text-center card-title">Expenses</h5>
        <form onSubmit={(e) => e.preventDefault()}>
          {fields.map((field, i) => (
            <div className="form-group row" key={i}>
              <label
                htmlFor={"expenses" + i}
                className="col-sm-3 col-form-label"
              >
                Expense #{i + 1}
              </label>
              <div className="col-sm-9">
                <div className="row input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">$</span>
                  </div>
                  <input
                    type="number"
                    className="form-control mr-2 col"
                    id={"expenses" + i}
                    placeholder="Enter number..."
                    value={field.value}
                    onChange={(e) => updateExpense(i, "value", e.target.value)}
                    step={0.01}
                    min={0}
                  />
                  <select
                    name={"expense-frequency" + i}
                    id={"expense-frequency" + i}
                    className="custom-select col"
                    onChange={(e) =>
                      updateExpense(i, "frequency", e.target.value)
                    }
                  >
                    <option
                      defaultValue
                      selected={1 === field.frequency}
                      value={1}
                    >
                      Per day
                    </option>
                    <option selected={7 === field.frequency} value={7}>
                      Per week
                    </option>
                    <option selected={30 === field.frequency} value={30}>
                      Per month (30 days)
                    </option>
                    <option selected={365 === field.frequency} value={365}>
                      Per year (365 days)
                    </option>
                  </select>
                  <button
                    type="button"
                    className="close col"
                    aria-label="Delete"
                    onClick={() => deleteExpense(i)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-block btn-outline-secondary"
            onClick={addExpense}
          >
            Add Expense
          </button>
        </form>
      </div>
      <div className="card-footer text-center text-danger">
        {currency(totalExpenses()).format()} annually
      </div>
    </div>
  );
}
