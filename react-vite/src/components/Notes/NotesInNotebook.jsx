import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateNote } from "../../redux/notes";
import "./NotesInNotebook.css";
import { getNotesForNotebook } from "../../redux/notes";
import { getNotebooks } from "../../redux/notebook";
import Tags from "../Tags/Tags";
import NotebookTasks from "../NotebookTasks/NotebookTasks";

const NotesInNotebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notebookId, noteId } = useParams();
  const notes = useSelector((state) => state.notes.Notes);
  const notebooks = useSelector((state) => state.notebooks.allNotebooks);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notebook_id, setNotebook_id] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [, setErrors] = useState([]);
  const notebook = notebooks[notebookId];

  useEffect(() => {
    dispatch(getNotesForNotebook(notebookId));
    dispatch(getNotebooks()).then(() => {
      // Set the first note as selected when notes are loaded
      const notesList = Object.values(notes);
      if (notesList.length > 0 && !selectedNote) {
        setSelectedNote(notesList[0]);
      }
    });
  }, [dispatch, notebookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const updatedNote = {
      title,
      content,
      notebook_id: parseInt(notebook_id),
    };

    return dispatch(updateNote(noteId, updatedNote))
      .then(() => {
        dispatch(getNotesForNotebook(notebookId));
      })
      .catch((res) => {
        if (res && res.errors) {
          setErrors(res.errors);
        }
      });
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setNotebook_id(note.notebook_id);
    navigate(`/notebooks/${notebookId}/note/${note.id}`);
  };

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setNotebook_id(selectedNote.notebook_id);
      // Reset selectedNote when notebook changes
      if (selectedNote && selectedNote.notebook_id !== parseInt(notebookId)) {
        setSelectedNote(null);
      }
    }
  }, [selectedNote, notebookId]);

  const isFormValid = () => {
    return title.trim() && content.trim() && notebook_id;
  };

  if (!notebook) return <h1>Loading...</h1>;

  return (
    <div className="notebook-notes-note-container">
      <div className="notebook-notes-container">
        <div className="notebook-notes-header-box">
          <h2 className="notes-in-notebook-header">{notebook.name}</h2>
          <h4 className="notes-in-notebook-count">
            {Object.keys(notes).length}{" "}
            {Object.keys(notes).length === 1 ? "note" : "notes"}
          </h4>
        </div>
        <div className="notebook-notes-column-container">
          <NotebookTasks notebookId={notebookId} />
          {Object.values(notes).map((note, index) => (
            <div
              key={index}
              className="notebook-note-card"
              onClick={() => handleNoteSelect(note)}
              style={{
                border: selectedNote?.id === note.id ? "1px solid #7DA9D6" : "",
                boxShadow:
                  selectedNote?.id === note.id ? "0 0 7px #7DA9D6" : "",
              }}
            >
              <h3 className="notebook-note-title">{note.title}</h3>
              <p className="notebook-note-content">
                {note.content.length > 100
                  ? note.content.slice(0, 99) + "..."
                  : note.content}
              </p>
              <Tags noteId={note.id} showInput={false} />
            </div>
          ))}
        </div>
      </div>
      {selectedNote && (
        <form
          onSubmit={handleSubmit}
          className="notebook-notes-note-form-container"
        >
          <div>
            <h1 className="notebook-notes-note-title">{selectedNote.title}</h1>
          </div>
          <div className="notebook-notes-note-label-container">
            <label className="notebook-notes-note-label">
              Title
              <input
                className="notebook-notes-note-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
            </label>
          </div>
          <div className="notebook-notes-note-label-container">
            <label className="notebook-notes-note-label">
              Content
              <textarea
                className="notebook-notes-note-content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                required
                rows={10}
              />
            </label>
          </div>
          <div className="notebook-notes-note-label-container">
            <label className="notebook-notes-note-label">
              Select Notebook
              <select
                className="notebook-notes-note-dropdown"
                value={notebook_id}
                onChange={(e) => setNotebook_id(e.target.value)}
                required
              >
                <option value="">Select a notebook</option>
                {Object.values(notebooks).map((nb, index) => (
                  <option key={index} value={nb.id}>
                    {nb.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="notebook-notes-note-button-container">
            <button
              type="submit"
              className="notebook-notes-note-button"
              disabled={!isFormValid()}
              style={{
                opacity: isFormValid() ? 1 : 0.5,
                cursor: isFormValid() ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          </div>
          <Tags noteId={selectedNote.id} showInput={true} />
        </form>
      )}
    </div>
  );
};

export default NotesInNotebook;
