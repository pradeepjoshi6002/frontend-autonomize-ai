import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import userStore from "./store/userStore.js";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={userStore}>
    <App />
  </Provider>
);
