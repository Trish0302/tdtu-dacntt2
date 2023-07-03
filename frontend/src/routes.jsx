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
import EditStorePage from "./pages/stores/EditStorePage";
import DetailStorePage from "./pages/stores/DetailStorePage";
import FoodGroupsPage from "./pages/stores/food_groups/FoodGroupsPage";
import { ListFoodGroupProvider } from "./stores/ListFoodGroupContext";
import AddFoodGroupPage from "./pages/stores/food_groups/AddFoodGroupPage";
import EditFoodGroupPage from "./pages/stores/food_groups/EditFoodGroupPage";
import DetailFoodGroupPage from "./pages/stores/food_groups/DetailFoodGroupPage";
import { ListFoodProvider } from "./stores/ListFoodContext";
import FoodsPage from "./pages/stores/food_groups/foods/FoodsPage";
import AddFoodPage from "./pages/stores/food_groups/foods/AddFoodPage";
import EditFoodPage from "./pages/stores/food_groups/foods/EditFoodPage";
import DetailFoodPage from "./pages/stores/food_groups/foods/DetailFoodPage";
import { ListVoucherProvider } from "./stores/ListVoucherContext";
import VouchersPage from "./pages/vouchers/VouchersPage";
import AddVoucherPage from "./pages/vouchers/AddVoucherPage";
import EditVoucherPage from "./pages/vouchers/EditVoucherPage";
import DetailVoucherPage from "./pages/vouchers/DetailVoucherPage";
import { ListOrderProvider } from "./stores/ListOrderContext";
import OrderPage from "./pages/orders/OrderPage";
import EditOrderPage from "./pages/orders/EditOrderPage";
import DetailOrderPage from "./pages/orders/DetailOrderPage";

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
          children: [
            {
              element: (
                <ListUserProvider>
                  <UsersPage />
                </ListUserProvider>
              ),
              index: true,
            },
            {
              path: "add",
              element: (
                <ListUserProvider>
                  <AddUserPage />
                </ListUserProvider>
              ),
            },
            {
              path: "edit/:id",
              element: (
                <ListUserProvider>
                  <EditUserPage />
                </ListUserProvider>
              ),
            },
            {
              path: "detail/:id",
              element: (
                <ListUserProvider>
                  <DetailUserPage />
                </ListUserProvider>
              ),
            },
          ],
        },

        {
          path: "stores",
          children: [
            {
              element: (
                <ListStoreProvider>
                  <StoresPage />
                </ListStoreProvider>
              ),
              index: true,
            },
            {
              path: "add",
              element: (
                <ListStoreProvider>
                  <AddStorePage />
                </ListStoreProvider>
              ),
            },
            {
              path: "edit/:id",
              element: (
                <ListStoreProvider>
                  <EditStorePage />
                </ListStoreProvider>
              ),
            },
            {
              path: "detail/:id",
              element: (
                <ListStoreProvider>
                  <DetailStorePage />
                </ListStoreProvider>
              ),
            },

            {
              path: ":id/food-group",
              element: (
                <ListFoodGroupProvider>
                  <FoodGroupsPage />
                </ListFoodGroupProvider>
              ),
            },
            {
              path: ":storeId/food-group/add",
              element: (
                <ListFoodGroupProvider>
                  <AddFoodGroupPage />
                </ListFoodGroupProvider>
              ),
            },
            {
              path: ":storeId/food-group/edit/:id",
              element: (
                <ListFoodGroupProvider>
                  <EditFoodGroupPage />
                </ListFoodGroupProvider>
              ),
            },
            {
              path: ":storeId/food-group/detail/:id",
              element: (
                <ListFoodGroupProvider>
                  <DetailFoodGroupPage />
                </ListFoodGroupProvider>
              ),
            },
            {
              path: ":storeId/food-group/:foodGroupId/food",
              element: (
                <ListFoodProvider>
                  <FoodsPage />
                </ListFoodProvider>
              ),
            },
            {
              path: ":storeId/food-group/:foodGroupId/food/add",
              element: (
                <ListFoodProvider>
                  <AddFoodPage />
                </ListFoodProvider>
              ),
            },
            {
              path: ":storeId/food-group/:foodGroupId/food/edit/:foodId",
              element: (
                <ListFoodProvider>
                  <EditFoodPage />
                </ListFoodProvider>
              ),
            },
            {
              path: ":storeId/food-group/:foodGroupId/food/detail/:foodId",
              element: (
                <ListFoodProvider>
                  <DetailFoodPage />
                </ListFoodProvider>
              ),
            },
          ],
        },

        {
          path: "food-groups",
          children: [
            {
              element: (
                <ListFoodGroupProvider>
                  <FoodGroupsPage />
                </ListFoodGroupProvider>
              ),
              index: true,
            },
            {
              path: "add",
              element: (
                <ListFoodGroupProvider>
                  <AddFoodGroupPage />
                </ListFoodGroupProvider>
              ),
            },
          ],
        },

        {
          path: "foods",
          children: [
            {
              element: (
                <ListFoodProvider>
                  <FoodsPage />
                </ListFoodProvider>
              ),
              index: true,
            },
            {
              path: "add",
              element: (
                <ListFoodProvider>
                  <AddFoodPage />
                </ListFoodProvider>
              ),
            },
          ],
        },

        {
          path: "vouchers",
          children: [
            {
              element: (
                <ListVoucherProvider>
                  <VouchersPage />
                </ListVoucherProvider>
              ),
              index: true,
            },

            {
              path: "add",
              element: (
                <ListVoucherProvider>
                  <AddVoucherPage />
                </ListVoucherProvider>
              ),
            },
            {
              path: "edit/:id",
              element: (
                <ListVoucherProvider>
                  <EditVoucherPage />
                </ListVoucherProvider>
              ),
            },
            {
              path: "detail/:id",
              element: (
                <ListVoucherProvider>
                  <DetailVoucherPage />
                </ListVoucherProvider>
              ),
            },
          ],
        },

        {
          path: "orders",
          children: [
            {
              element: (
                <ListOrderProvider>
                  <OrderPage />
                </ListOrderProvider>
              ),
              index: true,
            },
            {
              path: "edit/:id",
              element: (
                <ListOrderProvider>
                  <EditOrderPage />
                </ListOrderProvider>
              ),
            },
            {
              path: "detail/:id",
              element: (
                <ListOrderProvider>
                  <DetailOrderPage />
                </ListOrderProvider>
              ),
            },
          ],
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
