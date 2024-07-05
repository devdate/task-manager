import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { deleteTask, toggleComplete } from "../../store/slices/taskSlice";
import { Link } from "react-router-dom";
import "./TaskList.css";
import IconEdit from "../icons/IconEdit";
import IconDelete from "../icons/IconDelete";
import IconCaretDown from "../icons/IconDown";
import Highlighter from "./Highlighter";

const priorityOrder: { [key: string]: number } = {
  High: 2,
  Medium: 1,
  Low: 0,
};

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCompleted, setfilterCompleted] = useState("");
  const [filterDueIn, setfilterDueIn] = useState("");
  const [filterExpand, setFilterExpand] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleComplete(id));
  };
  const debounce = (fn: Function, ms = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };
  const debouncedSetSearchText = debounce(setSearchText);
  const clearAll = () => {
    setSearchText("");
    setFilterDate("");
    setFilterPriority("");
    setfilterCompleted("");
    setSortBy("");
  };

  const filterParser = (date: string, filter: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    switch (filter) {
      case "year":
        return diff > 31536000000;
      case "month":
        return diff > 2592000000 && diff <= 31536000000;
      default:
        return diff <= 2592000000;
    }
  };

  const dateParser = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    if (diff > 31536000000) {
      return "Due in more than a year";
    } else if (diff > 2592000000) {
      return "Due in more than a month";
    }
    return `Due in ${Math.ceil(diff / 86400000)} days`;
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      <div className="filter-container" style={{ ...(filterExpand && { maxHeight: "250px" }) }}>
        <div className="form-group-filter" style={{ flex: 1 }}>
          <input
            type="text"
            style={{ width: "100%" }}
            title="search"
            name="search"
            placeholder="Search Name or Description..."
            onChange={(e) => debouncedSetSearchText(e.target.value)}
          />
          <button
            id="expand-more-filters"
            name="Expand More Filters"
            title="Expand More Filters"
            style={{ outline: "none" }}
            onClick={() => setFilterExpand((prev) => !prev)}
          >
            <IconCaretDown style={{ rotate: filterExpand ? "180deg" : "unset" }} />
          </button>
        </div>
        <div className="form-group-filter">
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </div>
        <div className="form-group-filter">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">None</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group-filter">
          <label htmlFor="completed">Task Status</label>
          <select id="completed" value={filterCompleted} onChange={(e) => setfilterCompleted(e.target.value)}>
            <option value="">None</option>
            <option value="Yes">Completed</option>
            <option value="No">Incomplete</option>
          </select>
        </div>
        <div className="form-group-filter">
          <label htmlFor="sort">Sort By</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="completed">Task Status</option>
          </select>
        </div>
        <div className="form-group-filter">
          <label htmlFor="dueIn">Due in</label>
          <select id="dueIn" value={filterDueIn} onChange={(e) => setfilterDueIn(e.target.value)}>
            <option value="">None</option>
            <option value="day">Days</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <button style={{ height: "35px", outline: "none" }} onClick={() => clearAll()}>
          Clear All
        </button>
      </div>
      <ul>
        {tasks
          .filter(
            (e) =>
              (!searchText || e.title.includes(searchText) || e.description.includes(searchText)) &&
              (!filterDate || e.dueDate === filterDate) &&
              (!filterPriority || e.priority === filterPriority) &&
              (!filterCompleted || e.completed === (filterCompleted === "Yes")) &&
              (!filterDueIn || filterParser(e.dueDate, filterDueIn))
          )
          .sort((a, b) => {
            if (sortBy === "dueDate") {
              return +new Date(a.dueDate) - +new Date(b.dueDate);
            } else if (sortBy === "priority") {
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }

            return +a.completed - +b.completed;
          })
          .map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
              <div className="title-icons">
                <h3>
                  <Highlighter fullText={task.title} searchText={searchText} />
                </h3>
                <Link title="Edit Task" aria-label="Edit Task" to={`/task/${task.id}`}>
                  <IconEdit />
                </Link>
                <button
                  title="Delete Task"
                  aria-label="Delete Task"
                  style={{ color: "white", backgroundColor: "red", padding: "5px" }}
                  onClick={() => handleDelete(task.id)}
                >
                  <IconDelete />{" "}
                </button>
              </div>
              <p style={{ marginBottom: "16px", whiteSpace: "pre-wrap" }}>
                <Highlighter fullText={task.description} searchText={searchText} />
              </p>
              <p style={{ marginTop: "auto" }}>Due: {task.dueDate}</p>
              <p style={{ marginTop: "auto" }}>Due in: {dateParser(task.dueDate)}</p>
              <p>Priority: {task.priority}</p>
              <button
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  background: task.completed ? "white" : "#88e388",
                  color: task.completed ? "red" : "unset",
                }}
                onClick={() => handleToggleComplete(task.id)}
              >
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TaskList;
