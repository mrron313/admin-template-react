import Dashboard from "views/Dashboard.js";
import Menus from "views/Menus.js";
import Menu from "views/Menu.js";
import Stores from "views/Stores.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    sidebar: true,
    layout: "/admin",
  },
  {
    path: "/menus",
    name: "Menus",
    component: Menus,
    sidebar: true,
    layout: "/admin",
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
    sidebar: false,
    layout: "/admin",
  },
  {
    path: "/stores",
    name: "Stores",
    component: Stores,
    sidebar: true,
    layout: "/admin",
  },
];

export default dashboardRoutes;
