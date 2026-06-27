import { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";

function TaskList() {

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {

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

      setTasks(res.data.slice(0, 5));

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchTasks();

  }, []);
    return (

    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-6">
        Today's Tasks
      </h2>

      <div className="space-y-4">

        {tasks.length === 0 ? (

          <p className="text-gray-500 text-center">
            No tasks found.
          </p>

        ) : (

          tasks.map((task) => (

            <div
              key={task._id}
              className="flex justify-between items-center border-b pb-4 last:border-0"
            >

              <div className="flex items-center gap-3">

                <FiCheckCircle className="text-blue-600 text-xl" />

                <span className={task.completed ? "line-through text-gray-400" : ""}>
                  {task.title}
                </span>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );
}

export default TaskList;