import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./store/store";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<TaskList />} />
              <Route path="/task" element={<TaskForm />} />
              <Route path="/task/:id" element={<TaskForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
