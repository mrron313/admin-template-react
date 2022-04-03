import Dashboard from 'views/Dashboard.js';
import Menus from 'views/Menus.js';
import Menu from 'views/Menu.js';

import Users from 'views/Users.js'
import User from 'views/User.js'

import Order from 'views/Order.js'
import Orders from 'views/Orders';

import Store from 'views/Store.js'
import Stores from 'views/Stores';

import Login from 'views/Login';

const dashboardRoutes = [
  {
    path: "/stores",
    name: "Stores",
    component: Stores,
    sidebar: true,
    layout: "/admin",
  },
  {
    path: "/store",
    name: "Store",
    component: Store,
    sidebar: false,
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
    path: "/orders",
    name: "Orders",
    component: Orders,
    sidebar: true,
    layout: "/admin",
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
    sidebar: false,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    sidebar: true,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User",
    component: User,
    sidebar: false,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    sidebar: false,
    layout: "/",
  },
];

export default dashboardRoutes;
