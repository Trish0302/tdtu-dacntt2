import { Navigate, useRoutes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Auth from "./utils/auth";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import CustomerPage from "./pages/customers/CustomerPage";
import StoresPage from "./pages/stores/StoresPage";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Auth>
          <DashboardLayout />
        </Auth>
      ),
      children: [
        {
          element: <Navigate to="/dashboard" />,
          index: true,
        },
        {
          path: "dashboard",
          element: (
            <Auth>
              <Dashboard />
            </Auth>
          ),
        },
        {
          path: "customers",
          element: <CustomerPage />,
        },
        {
          path: "stores",
          element: <StoresPage />,
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);
  return routes;
};

export default Router;
