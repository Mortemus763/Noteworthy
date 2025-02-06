const LOAD_CURRENT = 'notes/LOAD_CURRENT';
const LOAD_BY_ID = 'notes/LOAD_BY_ID'
const CREATE_NOTE = 'notes/CREATE_NOTENOTE';
const UPDATE_NOTE = 'notes/UPDATE_NOTE';
const DELETE_NOTE = 'notes/DELETE_NOTE';
const SET_NOTE_TAGS = 'notes/SET_NOTE_TAGS';


const loadCurrent = notes => ({
    type: LOAD_CURRENT,
    notes
})

const loadById = note => ({
    type: LOAD_BY_ID,
    note
})

const createNote = (note) => ({
    type: CREATE_NOTE,
    payload: note
})

const updateNote = (note) => ({
    type: UPDATE_NOTE,
    payload: note
})

const deleteNote = (noteId) => ({
    type: DELETE_NOTE,
    noteId
})

const getTagsForNote = (noteId) => ({
    type: SET_NOTE_TAGS,
    noteId
})


export const getCurrentUserNotes = () => async dispatch => {
    const response = await fetch(`/api/notes/current`);
    const tags = await fetch(`/api/`)

    if (response.ok) {
        const notes = await response.json();
        dispatch(loadCurrent(notes));
        return notes
    }
}

export const getNoteTags = (noteId) => async dispatch => {
    const response = await fetch(`/api/tags/${noteId}/tags`);
    
    if (response.ok) {
        const tags = await response.json();
        // Create a new action type to handle adding tags to a note
        dispatch(getNoteTags(noteId), tags);
        return tags;
    }
}


const initialState = {
    Notes: {}
}

const notesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURRENT: {
            const newState = { ...state };
            newState.Notes = {};
            const notesArray = action.notes.Notes;
            notesArray.forEach(note => {
                newState.Notes[note.id] = {
                    ...note,
                    tags: []
                }
            });
            return newState;
        }
        case SET_NOTE_TAGS: {
            const newState = { ...state };
            newState.Notes[action.noteId] = {
                ...newState.Notes[action.noteId],
                tags: action.tags
            };
            return newState;
        }
        default:
            return state;
    }
}

export default notesReducer;