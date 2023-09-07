import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import CardDashboard from "../../components/card/CardDashboard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { call } from "../../utils/api";
import { toast } from "react-toastify";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Order and Customer Group by Store",
      font: {
        size: 24,
      },
    },
  },
};

export const optionPieStore = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Top 5 Store Profit",
      font: {
        size: 24,
      },
    },
  },
};
export const optionPieFood = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Top 5 Most Purchased Food",
      font: {
        size: 24,
      },
    },
  },
};

export const optionOrderByDay = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "",
      font: {
        size: 24,
      },
    },
  },
};

const Dashboard = () => {
  const [storeStatistics, setStoreStatistics] = useState();
  const [storeProfit, setStoreProfit] = useState();
  const [orderRecent, setOrderRecent] = useState();
  const [foodPurchase, setFoodPurchase] = useState();
  const [filteredOrder, setFilteredOrder] = useState();
  const [totalData, setTotalData] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);

  const handleFilterOrder = () => {
    setLoadingFilter(true);
    if (!fromDate || !toDate) {
      toast.error("Please choose all field", { autoClose: 2000 });
    } else {
      call(
        `api/statistics/get-total-orders?from=${fromDate}&to=${toDate}`
      ).then((rs) => {
        console.log(">>> order ", rs);
        setFilteredOrder({
          labels: rs.data.map((item) => item.date),
          datasets: [
            {
              label: "Quantity Order",
              data: rs.data.map((item) => item.total_orders),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setLoadingFilter(false);
      });
    }
  };

  useEffect(() => {
    const call1 = call(`api/statistics/get-total?type=init`).then((rs) => {
      setTotalData(rs.data);
    });

    const call2 = call(`api/statistics/get-top-stores`).then((rs) => {
      setStoreStatistics({
        labels: rs.data.map((item) => item.store.name),
        datasets: [
          {
            label: "Total Orders",
            data: rs.data.map((item) => item.total_orders),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Total Customers",
            data: rs.data.map((item) => item.total_customers),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          // {
          //   label: "Total Profits",
          //   data: rs.data.map((item) => item.total_profits),
          //   backgroundColor: "rgba(255, 99, 132, 0.5)",
          // },
        ],
      });
      setStoreProfit({
        labels: rs.data.map((item) => item.store.name),
        datasets: [
          {
            label: "Store Profit",
            data: rs.data.map((item) => item.total_profits),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    });

    const call3 = call(`api/statistics/get-recent-orders`).then((rs) => {
      setOrderRecent(rs.data);
    });
    const call4 = call(`api/statistics/get-top-products`).then((rs) => {
      setFoodPurchase({
        labels: rs.data.map((item) => item.food.name),
        datasets: [
          {
            label: "Quantity",
            data: rs.data.map((item) => item.count_food),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    });

    Promise.all([call1, call2, call3, call4]).then((responses) => {
      setLoading(false);
    });
  }, []);

  return loading ? (
    <div className="w-full h-full flex items-center justify-center bg-primary-100">
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <div className="bg-primary-100 px-5 h-full overflow-y-scroll hide-scroll pt-24 pb-5">
      <div className="flex gap-4">
        <div className="basis-1/4">
          <CardDashboard
            title="Total of users in system"
            quantity={totalData?.user}
            unit="users"
          />
        </div>
        <div className="basis-1/4">
          <CardDashboard
            title="Total of stores in system"
            quantity={totalData?.store}
            unit="stores"
          />
        </div>
        <div className="basis-1/4">
          <CardDashboard
            title="Total of orders in system"
            quantity={totalData?.order}
            unit="orders"
          />
        </div>
        <div className="basis-1/4">
          <CardDashboard
            title="Profit of system"
            quantity={parseFloat(totalData?.profit).toLocaleString()}
            unit="₫"
          />
        </div>
      </div>

      <div className="flex gap-10 items-center mt-10">
        <div className="basis-2/3">
          <Card sx={{ p: 2 }}>
            <div className="text-center font-semibold text-xl">
              Five Most Recent Order
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderRecent &&
                    orderRecent.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.order.name}
                        </TableCell>
                        <TableCell align="right">{row.order.phone}</TableCell>
                        <TableCell align="right">
                          {parseFloat(row.order.total).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <div className="w-full flex justify-end">
                            <div
                              className={` ${
                                row.history.message ==
                                "Order was placed successfully."
                                  ? "bg-[#EB966A]/[.24] text-[#FFB572]"
                                  : row.history.message ==
                                    "Order was paid successfully."
                                  ? "bg-[#6BE2BE]/[.24] text-[#50D1AA]"
                                  : "bg-red-600/[.24] text-red-500"
                              }  w-fit rounded-2xl p-2`}
                            >
                              {row.history.message}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </div>
        <div className="basis-1/3">
          <Card
            sx={{
              padding: "20px",
              height: "100%",
              width: "100%",
            }}
          >
            {storeProfit && (
              <Pie options={optionPieStore} data={storeProfit} height="30%" />
            )}
          </Card>
        </div>
      </div>

      <div className="flex gap-10 items-center mt-10">
        <div className="basis-2/3">
          <Card sx={{ padding: "20px", height: "100%", width: "100%" }}>
            {storeStatistics && (
              <Bar options={options} data={storeStatistics} />
            )}
          </Card>
        </div>
        <div className="basis-1/3">
          <Card
            sx={{
              padding: "20px",
              height: "100%",
              width: "100%",
            }}
          >
            {foodPurchase && (
              <Pie options={optionPieFood} data={foodPurchase} height="30%" />
            )}
          </Card>
        </div>
      </div>

      <div className="">
        <Card sx={{ p: 3, mt: 3 }}>
          <div className="text-center font-semibold text-xl ">
            Filter Order By Days
          </div>
          <div className="flex gap-5 mt-4">
            <div className="flex items-center">
              <label className="mr-2">From: </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(val) => setFromDate(val.format("YYYY-MM-DD"))}
                />
              </LocalizationProvider>
            </div>
            <div className="flex items-center">
              <label className="mr-2">To: </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(val) => setToDate(val.format("YYYY-MM-DD"))}
                />
              </LocalizationProvider>
            </div>

            <button
              className="px-4 rounded-lg bg-primary-500 text-white hover:opacity-80 duration-200"
              onClick={handleFilterOrder}
            >
              {loadingFilter ? (
                <CircularProgress size="1.5rem" color="secondary" />
              ) : (
                "Apply"
              )}
            </button>
          </div>

          {/* chart */}
          {filteredOrder && (
            <Bar options={optionOrderByDay} data={filteredOrder} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
