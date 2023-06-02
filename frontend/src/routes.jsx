import { Navigate, useRoutes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Auth from "./utils/auth";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import CustomerPage from "./pages/customers/CustomerPage";
import StoresPage from "./pages/stores/StoresPage";
import UsersPage from "./pages/users/UsersPage";
import { ListUserProvider } from "./stores/ListUserContext";
import AddUserPage from "./pages/users/AddUserPage";
import EditUserPage from "./pages/users/EditUserPage";
import DetailUserPage from "./pages/users/DetailUserPage";
import AddStorePage from "./pages/stores/AddStorePage";
import { ListStoreProvider } from "./stores/ListStoreContext";

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
          path: "users",
          element: (
            <ListUserProvider>
              <UsersPage />
            </ListUserProvider>
          ),
        },
        {
          path: "add-user",
          element: (
            <ListUserProvider>
              <AddUserPage />
            </ListUserProvider>
          ),
        },
        {
          path: "edit-user/:id",
          element: (
            <ListUserProvider>
              <EditUserPage />
            </ListUserProvider>
          ),
        },
        {
          path: "detail-user/:id",
          element: (
            <ListUserProvider>
              <DetailUserPage />
            </ListUserProvider>
          ),
        },
        {
          path: "stores",
          element: (
            <ListStoreProvider>
              <StoresPage />
            </ListStoreProvider>
          ),
        },
        {
          path: "add-store",
          element: (
            <ListStoreProvider>
              <AddStorePage />
            </ListStoreProvider>
          ),
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
