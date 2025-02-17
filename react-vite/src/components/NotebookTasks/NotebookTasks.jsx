import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getNotebookTasks, updateTask } from "../../redux/task";
import "./NotebookTasks.css";

const selectNotebookTasks = createSelector(
  (state) => state.task.notebookTasks,
  (_, notebookId) => notebookId,
  (notebookTasks, notebookId) => notebookTasks[notebookId] || {}
);

function NotebookTasks({ notebookId }) {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const notebookTasks = useSelector((state) =>
    selectNotebookTasks(state, notebookId)
  );

  const [checkedTasks, setCheckedTasks] = useState({});

  useEffect(() => {
    dispatch(getNotebookTasks(notebookId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, notebookId]);

  useEffect(() => {
    const initialCheckedTasks = {};
    Object.values(notebookTasks).forEach((task) => {
      initialCheckedTasks[task.id] = task.completed;
    });
    setCheckedTasks(initialCheckedTasks);
  }, [notebookTasks]);

  const handleCheckBoxChange = async (taskId) => {
    const newCheckedTasks = {
      ...checkedTasks,
      [taskId]: !checkedTasks[taskId],
    };
    setCheckedTasks(newCheckedTasks);

    const updatedTask = { completed: newCheckedTasks[taskId] };
    await dispatch(updateTask(taskId, updatedTask));
    await dispatch(getNotebookTasks(notebookId));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {isLoaded && (
        <div className="notebook-tasks-container">
          <details className="notebook-tasks-details">
            <summary className="things-to-do">Things to do:</summary>
            {Object.keys(notebookTasks).length > 0 ? (
              <div className="notebook-tasks-list">
                {Object.values(notebookTasks)
                  .sort((a, b) => {
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;
                    return new Date(a.due_date) - new Date(b.due_date);
                  })
                  .map((task) => (
                    <div key={task.id} className="notebook-tasks-list-item">
                      <div className="notebook-tasks-list-box-1">
                        <input
                          type="checkbox"
                          className="notebook-tasks-list-checkbox"
                          checked={checkedTasks[task.id] || false}
                          onChange={() => handleCheckBoxChange(task.id)}
                          name="group1"
                          value={task.id}
                        ></input>
                        <div className="notebook-tasks-list-text">
                          <p
                            className="notebook-tasks-list-item-title"
                            style={{
                              color: checkedTasks[task.id]
                                ? "#bcbcbc"
                                : "inherit",
                              textDecoration: checkedTasks[task.id]
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {task.title}
                          </p>
                          <p className="notebook-tasks-list-item-description">
                            {task.description && task.description.length > 35
                              ? task.description.slice(0, 35) + "..."
                              : task.description || null}
                          </p>
                        </div>
                      </div>
                      <p className="notebook-tasks-list-item-due-date">
                        {task.due_date ? formatDate(task.due_date) : null}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No tasks found for this notebook.</p>
            )}
          </details>
        </div>
      )}
    </>
  );
}

export default NotebookTasks;
