import Account from "./routes/account";
import Root from "./routes/root";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Task from "./routes/task";
import { AppModel } from "./models/app-model";
import Transfer from "./routes/transfer";
import Faucet from "./routes/water-faucet";
import Counter from "./routes/counter";
import SwapRoot from "./routes/swap/root";
import Escrows from "./routes/swap/pages/escrows";
import Locked from "./routes/swap/pages/locked";

export default function App() {
  return (
    <AppModel.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Root />}>
            <Route index element={<Account />} />
            <Route path="task" element={<Task />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="faucet" element={<Faucet />} />
            <Route path="counter" element={<Counter />} />
            <Route path="swap" element={<SwapRoot />}>
              <Route index element={<Navigate to="escrows" />} />
              <Route path="escrows" element={<Escrows />} />
              <Route path="locked" element={<Locked />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppModel.Provider>
  );
}
