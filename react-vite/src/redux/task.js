import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

// Action Types
const LOAD_TASKS = "tasks/loadTasks";
const ADD_TASK = "tasks/addTask";

// Action Creators
const loadTasks = (tasks) => {
  return {
    type: LOAD_TASKS,
    tasks,
  };
};

const addTask = (task) => {
  return {
    type: ADD_TASK,
    task,
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

// Reducer
const initialState = { userTasks: {} };

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
