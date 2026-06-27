import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";

function Notes() {

  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const fetchNotes = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lifetrack-e2sm.onrender.com/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {

      const payload = {
        title: form.title,
        content: form.description,
        category: "Personal",
      };

      if (editId) {

        await axios.put(
          `https://lifetrack-e2sm.onrender.com/api/notes/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditId(null);

      } else {

        await axios.post(
          "https://lifetrack-e2sm.onrender.com/api/notes",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      fetchNotes();

      setForm({
        title: "",
        description: "",
      });

      setShowModal(false);

    } catch (err) {

      console.log(err);

      alert("Something went wrong");

    }

  };
    const handleEdit = (note) => {

    setEditId(note._id);

    setForm({
      title: note.title,
      description: note.content,
    });

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this note?")) return;

    const token = localStorage.getItem("token");

    try {

      await axios.delete(
        `https://lifetrack-e2sm.onrender.com/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotes();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Notes
        </h1>

        <button
          onClick={() => {

            setShowModal(true);

            setEditId(null);

            setForm({
              title: "",
              description: "",
            });

          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
        >
          <FiPlus />
          Add Note
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

        <div className="flex items-center border rounded-xl px-4 py-3">

          <FiSearch className="text-xl text-gray-500" />

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-3 outline-none w-full"
          />

        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNotes.length === 0 ? (

          <div className="col-span-full bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            No notes found.
          </div>

        ) : (

          filteredNotes.map((note) => (

            <div
              key={note._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-6"
            >

              <div className="flex justify-between items-start">

                <div className="flex-1 pr-5">

                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {note.title}
                  </h2>

                  <p className="text-slate-600 whitespace-pre-wrap">
                    {note.content}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-xl"
                  >
                    <FiEdit2 className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-100 hover:bg-red-200 p-3 rounded-xl"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[500px] rounded-2xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editId ? "Edit Note" : "Add Note"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                <FiX className="text-2xl text-gray-500 hover:text-red-500" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
                            <div>

                <label className="block mb-2 font-medium">
                  Note Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter note title"
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Description
                </label>

                <textarea
                  rows="6"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write your note..."
                  className="w-full border rounded-xl p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
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
                    });

                  }}
                  className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                >
                  <FiSave />

                  {editId ? "Update Note" : "Save Note"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}

export default Notes;