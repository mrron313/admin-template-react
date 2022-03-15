import Dashboard from "views/Dashboard.js";
import Menus from "views/Menus.js";
import Stores from "views/Stores.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/menus",
    name: "Menus",
    icon: "nc-icon nc-chart-pie-35",
    component: Menus,
    layout: "/admin",
  },
  {
    path: "/stores",
    name: "Stores",
    icon: "nc-icon nc-chart-pie-35",
    component: Stores,
    layout: "/admin",
  },
];

export default dashboardRoutes;
