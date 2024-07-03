import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask } from "../../store/slices/taskSlice";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import "./TaskForm.css";

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskToEdit = useSelector((state: RootState) => state.tasks.tasks.find((task) => task.id === id));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
    }
  }, [taskToEdit]);

  useEffect(() => {
    validateForm();
  }, [title, description, dueDate, priority]);

  const validateForm = () => {
    const isTitleValid = title.trim() !== "";
    const isDescriptionValid = description.trim() !== "";
    const isDueDateValid = dueDate && new Date(dueDate).getTime() > Date.now();
    const isPriorityValid = priority.trim() !== "";

    // @ts-ignore
    setIsFormValid(isTitleValid && isDescriptionValid && isDueDateValid && isPriorityValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(dueDate);
    e.preventDefault();
    if (!isFormValid) return;

    const task = {
      id: isEditing ? id! : uuidv4(), // Ensure id is a string
      title,
      description,
      dueDate,
      priority,
      completed: false,
    };

    if (isEditing) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }

    navigate("/");
  };

  return (
    <div className="task-form">
      <h2>{isEditing ? "Edit Task" : "Add New Task"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} aria-required="true" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea aria-label="task description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} aria-required="true"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-required="true" />
          {dueDate && new Date(dueDate).getTime() <= Date.now() && <p className="error">Due date must be in the future.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} aria-required="true">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button style={{ width: "100%", backgroundColor: "lightblue", padding: "16px", borderRadius: "15px" }} type="submit" disabled={!isFormValid}>
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
