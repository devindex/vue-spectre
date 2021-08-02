import Autocomplete from './Autocomplete';
import Calendar from './Calendar';
import Dropdown from './Dropdown';
import Inputs from './Inputs';
// import Modal from './Modal';
// import Notification from './Notification';
import Pagination from './Pagination';
import Tabs from './Tabs';
// import Toast from './Toast';

export default [
  {
    path: '/autocomplete',
    name: 'Autocomplete',
    component: Autocomplete,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: Dropdown,
  },
  {
    path: '/inputs',
    name: 'Inputs',
    component: Inputs,
  },
  // {
  //   path: '/modal',
  //   name: 'Modal',
  //   component: Modal,
  // },
  // {
  //   path: '/notification',
  //   name: 'Notification',
  //   component: Notification,
  // },
  {
    path: '/pagination',
    name: 'Pagination',
    component: Pagination,
  },
  {
    path: '/tabs',
    name: 'Tabs',
    component: Tabs,
  },
  // {
  //   path: '/toast',
  //   name: 'Toast',
  //   component: Toast,
  // },
];
