import Account from "./routes/account";
import Home from "./routes/home";
import Root from "./routes/root";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Task from "./routes/task";
import { AppModel } from "./models/app.model";

export default function App() {
  return (
    <AppModel.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="account" element={<Account />} />
            <Route path="task" element={<Task />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppModel.Provider>
  );
}
