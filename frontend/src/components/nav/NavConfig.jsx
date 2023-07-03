import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PercentIcon from "@mui/icons-material/Percent";
import ListAltIcon from "@mui/icons-material/ListAlt";

const navConfig = [
  {
    title: "dashboard",
    path: "/",
    icon: <DashboardIcon className="text-primary-500" />,
  },
  {
    title: "users",
    path: "/users",
    icon: <PersonIcon className="text-primary-500" />,
  },

  {
    title: "stores",
    path: "/stores",
    icon: <StoreMallDirectoryIcon className="text-primary-500" />,
  },

  {
    title: "food groups",
    path: "/food-groups",
    icon: <LocalDiningIcon className="text-primary-500" />,
  },
  {
    title: "foods",
    path: "/foods",
    icon: <FastfoodIcon className="text-primary-500" />,
  },
  {
    title: "vouchers",
    path: "/vouchers",
    icon: <PercentIcon className="text-primary-500" />,
  },

  {
    title: "orders",
    path: "/orders",
    icon: <ListAltIcon className="text-primary-500" />,
  },
];

export default navConfig;
