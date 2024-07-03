import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header aria-label="header" className={styles.header}>
      <Link to="/">
        <h1 aria-label="Task manager">Task Manager</h1>
      </Link>
      <Link to="/task" aria-label="Link to add new Task" className="add-new-link">
        Add New Task
      </Link>
    </header>
  );
};

export default Header;
