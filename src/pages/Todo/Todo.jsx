import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";

function Todo() {

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const fetchTodos = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lifetrack-e2sm.onrender.com/api/todo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.title || !form.dueDate) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {

      if (editId) {

        await axios.put(
          `https://lifetrack-e2sm.onrender.com/api/todo/${editId}`,
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
          "https://lifetrack-e2sm.onrender.com/api/todo",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      fetchTodos();

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      setShowModal(false);

    } catch (err) {

      console.log(err);

      alert("Something went wrong");

    }

  };
    const handleEdit = (task) => {

    setEditId(task._id);

    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
    });

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this task?")) return;

    const token = localStorage.getItem("token");

    try {

      await axios.delete(
        `https://lifetrack-e2sm.onrender.com/api/todo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTodos();

    } catch (err) {

      console.log(err);

    }

  };

  const toggleComplete = async (id) => {

    const token = localStorage.getItem("token");

    try {

      await axios.patch(
        `https://lifetrack-e2sm.onrender.com/api/todo/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTodos();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          To-Do List
        </h1>

        <button
          onClick={() => {

            setShowModal(true);

            setEditId(null);

            setForm({
              title: "",
              description: "",
              priority: "Medium",
              dueDate: "",
            });

          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
        >
          <FiPlus />
          Add Task
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

        <div className="flex items-center border rounded-xl px-4 py-3">

          <FiSearch className="text-xl text-gray-500" />

          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-3 outline-none w-full"
          />

        </div>

      </div>

      <div className="space-y-4">
              {filteredTasks.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No tasks found.
          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition"
            >

              <div className="flex items-center gap-4">

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id)}
                  className="w-5 h-5 accent-blue-600"
                />

                <div>

                  <h2
                    className={`text-lg font-semibold ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h2>

                  {task.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {task.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mt-1">
                    Due :
                    {" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No Date"}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                >
                  <FiEdit2 className="text-blue-600" />
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
                >
                  <FiTrash2 className="text-red-600" />
                </button>

              </div>

            </div>

          ))

        )}
      </div>
     {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[450px] rounded-2xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editId ? "Edit Task" : "Add Task"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                <FiX className="text-2xl text-gray-500" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >      
              <div>

                <label className="block mb-2 font-medium">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  className="w-full border rounded-xl p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none"
                />

              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);

                    setForm({
                      title: "",
                      description: "",
                      priority: "Medium",
                      dueDate: "",
                    });
                  }}
                  className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                  <FiCheck />

                  {editId ? "Update Task" : "Save Task"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}
     
     </DashboardLayout>
  );
}

export default Todo;