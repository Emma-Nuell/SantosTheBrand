import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";

const Placeholder = ({ title }) => (
  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
    <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
      {title}
    </h2>
    <p className="text-slate-600 dark:text-slate-400">
      This content is coming soon.
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="products"
            element={<Placeholder title="Products Management" />}
          />
          <Route
            path="orders"
            element={<Placeholder title="Orders Processing" />}
          />
          <Route
            path="customers"
            element={<Placeholder title="Customer Directory" />}
          />
          <Route
            path="analytics"
            element={<Placeholder title="Analytics & Reports" />}
          />
          <Route
            path="settings"
            element={<Placeholder title="System Settings" />}
          />
          <Route path="*" element={<Placeholder title="404 - Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
