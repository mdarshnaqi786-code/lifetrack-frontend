import { useEffect, useState } from "react";
import axios from "axios";

import DashboardLayout from "../../layouts/DashboardLayout";

import Greeting from "../../components/Dashboard/Greeting";
import StatCard from "../../components/Dashboard/StatCard";
import TaskList from "../../components/Dashboard/TaskList";
import NotesList from "../../components/Dashboard/NotesList";

import { FaTasks, FaStickyNote, FaWallet, FaHeartbeat } from "react-icons/fa";

function Dashboard() {
  const [taskCount, setTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [bmi, setBmi] = useState("0");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [todoRes, noteRes, expenseRes, healthRes] = await Promise.all([
        axios.get("https://lifetrack-e2sm.onrender.com/api/todo", { headers }),

        axios.get("https://lifetrack-e2sm.onrender.com/api/notes", { headers }),

        axios.get("https://lifetrack-e2sm.onrender.com/api/expenses", { headers }),

        axios.get("https://lifetrack-e2sm.onrender.com/api/health", { headers }),
      ]);

      setTaskCount(todoRes.data.length);

      setNoteCount(noteRes.data.length);

      let income = 0;
      let expense = 0;

      expenseRes.data.forEach((item) => {
        if (item.type === "Income") {
          income += Number(item.amount);
        } else {
          expense += Number(item.amount);
        }
      });

      setBalance(income - expense);

      if (healthRes.data.length > 0) {
        const h = healthRes.data[0];

        const bmiValue = (
          h.weight /
          ((h.height / 100) * (h.height / 100))
        ).toFixed(1);

        setBmi(bmiValue);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <DashboardLayout>
      <Greeting />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tasks"
          value={taskCount}
          icon={<FaTasks />}
          color="bg-blue-600"
        />

        <StatCard
          title="Notes"
          value={noteCount}
          icon={<FaStickyNote />}
          color="bg-green-600"
        />

        <StatCard
          title="Balance"
          value={`₹${balance}`}
          icon={<FaWallet />}
          color="bg-yellow-500"
        />

        <StatCard
          title="BMI"
          value={bmi}
          icon={<FaHeartbeat />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TaskList />

        <NotesList />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
