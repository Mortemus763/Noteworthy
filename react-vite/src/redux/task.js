import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

// Action Types
const LOAD_TASKS = "tasks/loadTasks";
const ADD_TASK = "tasks/addTask";
const UPDATE_TASK = "tasks/updateTask";
const REMOVE_TASK = "tasks/removeTask";
const LOAD_NOTEBOOK_TASKS = "tasks/loadNotebookTasks";

// Action Creators
const loadTasks = (tasks) => {
  return {
    type: LOAD_TASKS,
    tasks,
  };
};

const loadNotebookTasks = (notebookId, tasks) => {
  return {
    type: LOAD_NOTEBOOK_TASKS,
    notebookId,
    tasks,
  };
};

const addTask = (task) => {
  return {
    type: ADD_TASK,
    task,
  };
};

const removeTask = (taskId) => {
  return {
    type: REMOVE_TASK,
    taskId,
  };
};

// Thunks
export const getUserTasks = () => async (dispatch) => {
  const response = await csrfFetch("/api/tasks/current");

  if (response.ok) {
    const data = await response.json();
    const tasks = data.Tasks;
    dispatch(loadTasks(tasks));
  } else {
    return await response.json();
  }
};

export const addTaskThunk = (taskData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/tasks/new", {
      method: "POST",
      headers,
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      const task = await response.json();
      dispatch(addTask(task));
      return task;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (e) {
    console.log("Error adding task:", e);
    return e;
  }
};

export const updateTask = (taskId, taskData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
    });
    const updatedTask = await response.json();
    dispatch({
      type: "UPDATE_TASK",
      payload: updatedTask,
    });
    return updatedTask;
  } catch (e) {
    return e;
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeTask(taskId));
      return response;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (e) {
    console.log("Unable to delete task :", e);
    return e;
  }
};

export const getNotebookTasks = (notebookId) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/notebook/${notebookId}`);

  if (response.ok) {
    const data = await response.json();
    const tasks = data.Tasks;
    dispatch(loadNotebookTasks(notebookId, tasks));
  } else {
    const error = await response.json();
    console.error("Failed to load notebook tasks:", error);
    throw error;
  }
};

// Reducer
const initialState = { userTasks: {}, notebookTasks: {} };

function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TASKS: {
      const userTasks = {};
      action.tasks.forEach((task) => {
        userTasks[task.id] = task;
      });
      return { ...state, userTasks };
    }
    case ADD_TASK: {
      const newState = { ...state };
      newState.userTasks[action.task.id] = action.task;
      return newState;
    }
    case UPDATE_TASK: {
      const updatedTask = action.payload;
      const currentTask = state.userTasks[updatedTask.id] || {};
      const updatedUserTasks = {
        ...state.userTasks,
        [updatedTask.id]: {
          ...currentTask,
          ...updatedTask,
        },
      };
      return {
        ...state,
        userTasks: updatedUserTasks,
      };
    }
    case REMOVE_TASK: {
      const newState = { ...state };
      delete newState.userTasks[action.taskId];
      return newState;
    }
    case LOAD_NOTEBOOK_TASKS: {
      return {
        ...state,
        notebookTasks: {
          [action.notebookId]: action.tasks.reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
          }, {}),
        },
      };
    }
    default:
      return state;
  }
}

// Selectors
export const selectUserTasks = (state) =>
  state.task?.userTasks || initialState.userTasks;

export const selectAllUserTasks = createSelector([selectUserTasks], (tasks) => {
  return Object.values(tasks);
});

export default tasksReducer;
