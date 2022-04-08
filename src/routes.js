import Menus from 'views/Menu/Menus.js';
import Menu from 'views/Menu/Menu.js';
import StoreMenu from 'views/Store/StoreMenu';

import Users from 'views/User/Users.js'
import User from 'views/User/User.js'

import Order from 'views/Order/Order.js'
import StoreOrders from 'views/Store/StoreOrders';
import Orders from 'views/Order/Orders';

import Store from 'views/Store/Store'
import Stores from 'views/Store/Stores';

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
    path: "/store/orders",
    name: "Store Orders",
    component: StoreOrders,
    sidebar: false,
    layout: "/admin",
  },
  {
    path: "/store/menu",
    name: "Menu",
    component: StoreMenu,
    sidebar: false,
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
