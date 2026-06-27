import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";

function Expenses() {

  const [transactions, setTransactions] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "Income",
    category: "",
    date: "",
  });

  const fetchExpenses = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lifetrack-e2sm.onrender.com/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.title ||
      !form.amount ||
      !form.category ||
      !form.date
    ) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/expenses/${editId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditId(null);

      } else {

        await axios.post(
          "http://localhost:5000/api/expenses",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      fetchExpenses();

      setForm({
        title: "",
        amount: "",
        type: "Income",
        category: "",
        date: "",
      });

      setShowModal(false);

    } catch (err) {

      console.log(err);

  console.log(err.response);

  console.log(err.response?.data);

  alert(err.response?.data?.message || "Something went wrong");

    }

  };
    const handleEdit = (transaction) => {

    setEditId(transaction._id);

    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date
        ? transaction.date.split("T")[0]
        : "",
    });

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this transaction?")) return;

    const token = localStorage.getItem("token");

    try {

      await axios.delete(
        `http://localhost:5000/api/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Expense Tracker
        </h1>

        <button
          onClick={() => {

            setShowModal(true);

            setEditId(null);

            setForm({
              title: "",
              amount: "",
              type: "Income",
              category: "",
              date: "",
            });

          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
        >
          <FiPlus />
          Add Transaction
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-green-500 text-white rounded-2xl p-8 shadow-lg">
          <p>Total Income</p>
          <h2 className="text-4xl font-bold mt-3">
            ₹{totalIncome}
          </h2>
        </div>

        <div className="bg-red-500 text-white rounded-2xl p-8 shadow-lg">
          <p>Total Expense</p>
          <h2 className="text-4xl font-bold mt-3">
            ₹{totalExpense}
          </h2>
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-lg">
          <p>Balance</p>
          <h2 className="text-4xl font-bold mt-3">
            ₹{balance}
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Transaction History
        </h2>

        <div className="space-y-4">
                    {transactions.length === 0 ? (

            <div className="text-center text-gray-500 py-10">
              No transactions found.
            </div>

          ) : (

            transactions.map((transaction) => (

              <div
                key={transaction._id}
                className="flex justify-between items-center border rounded-xl p-4"
              >

                <div>

                  <h3 className="font-semibold text-lg">
                    {transaction.title}
                  </h3>

                  <p className="text-gray-500">
                    {transaction.category}
                  </p>

                  <small>
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString()
                      : ""}
                  </small>

                </div>

                <div className="flex items-center gap-4">

                  <div className="text-right">

                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Income"
                        ? "+"
                        : "-"}
                      ₹{transaction.amount}
                    </p>

                    <small>
                      {transaction.type}
                    </small>

                  </div>

                  <button
                    onClick={() => handleEdit(transaction)}
                    className="bg-blue-100 p-3 rounded-xl hover:bg-blue-200"
                  >
                    <FiEdit2 className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="bg-red-100 p-3 rounded-xl hover:bg-red-200"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white w-[500px] rounded-2xl p-8">

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {editId
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                <FiX className="text-2xl" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
               <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              <select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full border rounded-xl p-3"
>
  <option value="">Select Category</option>
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Shopping">Shopping</option>
  <option value="Bills">Bills</option>
  <option value="Education">Education</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Healthcare">Healthcare</option>
  <option value="Salary">Salary</option>
  <option value="Investment">Investment</option>
  <option value="Other">Other</option>
</select>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {

                    setShowModal(false);

                    setEditId(null);

                    setForm({
                      title: "",
                      amount: "",
                      type: "Income",
                      category: "",
                      date: "",
                    });

                  }}
                  className="bg-gray-200 px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
                >
                  <FiSave />
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Expenses;