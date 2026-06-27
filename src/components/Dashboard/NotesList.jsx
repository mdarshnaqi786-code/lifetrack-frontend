import { useEffect, useState } from "react";
import axios from "axios";

function NotesList() {

  const [notes, setNotes] = useState([]);

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

      setNotes(res.data.slice(0, 5));

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchNotes();

  }, []);
    return (

    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Notes
      </h2>

      <div className="space-y-4">

        {notes.length === 0 ? (

          <p className="text-gray-500 text-center">
            No notes found.
          </p>

        ) : (

          notes.map((note) => (

            <div
              key={note._id}
              className="border-b pb-4 last:border-0"
            >

              <h3 className="font-semibold text-slate-800">
                {note.title}
              </h3>

              <p className="text-slate-600 mt-1 line-clamp-2">
                {note.content}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default NotesList;