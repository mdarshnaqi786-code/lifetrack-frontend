import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FiRefreshCw, FiSave } from "react-icons/fi";

function Health() {

  const [recordId, setRecordId] = useState(null);

  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(68);
  const [water, setWater] = useState(2.5);
  const [sleep, setSleep] = useState(7);
  const [exercise, setExercise] = useState("");
  const [medicine, setMedicine] = useState("");

  const fetchHealth = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lifetrack-e2sm.onrender.com/api/health",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.length > 0) {

        const health = res.data[0];

        setRecordId(health._id);
        setHeight(health.height);
        setWeight(health.weight);
        setWater(health.waterIntake);
        setSleep(health.sleepHours);
        setExercise(health.exercise);
        setMedicine(health.medicine);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchHealth();

  }, []);

  const bmi =
    height && weight
      ? (
          weight /
          ((height / 100) * (height / 100))
        ).toFixed(1)
      : "0";

  let bmiStatus = "";
  let bmiColor = "";

  if (bmi > 0 && bmi < 18.5) {

    bmiStatus = "Underweight";
    bmiColor = "bg-blue-500";

  } else if (bmi >= 18.5 && bmi < 25) {

    bmiStatus = "Normal Weight";
    bmiColor = "bg-green-500";

  } else if (bmi >= 25 && bmi < 30) {

    bmiStatus = "Overweight";
    bmiColor = "bg-orange-500";

  } else if (bmi >= 30) {

    bmiStatus = "Obese";
    bmiColor = "bg-red-500";

  } else {

    bmiStatus = "Enter Details";
    bmiColor = "bg-slate-500";

  }

  const resetData = () => {

    setHeight(170);
    setWeight(68);
    setWater(2.5);
    setSleep(7);
    setExercise("");
    setMedicine("");

  };

  const saveData = async () => {

    const token = localStorage.getItem("token");

    const data = {

      height,
      weight,
      waterIntake: water,
      sleepHours: sleep,
      exercise,
      medicine,

    };

    try {

      if (recordId) {

        await axios.put(

          `https://lifetrack-e2sm.onrender.com/api/health/${recordId}`,

          data,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

      } else {

        const res = await axios.post(

          "https://lifetrack-e2sm.onrender.com/api/health",

          data,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        setRecordId(res.data._id);

      }

      alert("Health details saved successfully!");

      fetchHealth();

    } catch (err) {

      console.log(err);

      console.log(err.response);

      console.log(err.response?.data);

      alert(err.response?.data?.message || "Something went wrong");

    }

  };
    return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-8">
        Health Tracker
      </h1>

      {/* Health Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div
          className={`${bmiColor} text-white rounded-2xl p-8 shadow-lg transition-all duration-500`}
        >
          <p className="text-lg font-medium">
            BMI
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {bmi}
          </h2>

          <p className="mt-3 text-lg font-semibold">
            {bmiStatus}
          </p>

        </div>

        <div className="bg-yellow-500 text-white rounded-2xl p-8 shadow-lg">

          <p className="text-lg">
            Weight
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {weight} kg
          </h2>

        </div>

        <div className="bg-cyan-500 text-white rounded-2xl p-8 shadow-lg">

          <p className="text-lg">
            Water Intake
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {water} L
          </h2>

        </div>

        <div className="bg-purple-600 text-white rounded-2xl p-8 shadow-lg">

          <p className="text-lg">
            Sleep
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {sleep} hrs
          </h2>

        </div>

      </div>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-8">
          Update Health Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
                    <div>

            <label className="font-semibold">
              Height (cm)
            </label>

            <input
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(Number(e.target.value))
              }
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Weight (kg)
            </label>

            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(Number(e.target.value))
              }
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Water Intake (Litres)
            </label>

            <input
              type="number"
              step="0.1"
              value={water}
              onChange={(e) =>
                setWater(Number(e.target.value))
              }
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Sleep (Hours)
            </label>

            <input
              type="number"
              value={sleep}
              onChange={(e) =>
                setSleep(Number(e.target.value))
              }
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Exercise
            </label>

            <input
              type="text"
              value={exercise}
              onChange={(e) =>
                setExercise(e.target.value)
              }
              placeholder="Walking, Running, Gym..."
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Medicine
            </label>

            <input
              type="text"
              value={medicine}
              onChange={(e) =>
                setMedicine(e.target.value)
              }
              placeholder="None"
              className="border rounded-xl p-3 w-full mt-2"
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">
                    <button
            onClick={resetData}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
          >
            <FiRefreshCw />
            Reset
          </button>

          <button
            onClick={saveData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            <FiSave />
            Save
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Health;