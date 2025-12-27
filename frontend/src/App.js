import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import "./App.css";
import HomeLayout from "./layouts/HomeLayout";
import PrintLayout from "./layouts/PrintLayout";
import Impexp from "./SharedComponents/Impexp";
import Day from "./SharedComponents/Day";
import Settings from "./SharedComponents/Settings";
import ModeratorLayout from "./layouts/ModeratorLayout";
import { useUserContext } from "./hooks/useUserContext";
import OrdersPage from "./components/OrdersPage/index";
import Login from "./SharedComponents/Login";
import "./styles/tailwind.css";
import ModeratorMainPage from "./ModeratorPages/ModeratorMainPage";
import WorkerMainPage from "./WorkerPages/WorkerMainPage";
import ReceiptPrintPage, { GetOrder } from "./WorkerPages/ReceiptPrintPage";
import FinishedOrders from "./SharedComponents/FinishedOrders";
import ClientBill from "./ModeratorPages/ClientBill";
import PurchaseBill from "./ModeratorPages/PurchaseBill";
import MoneyVault from "./ModeratorPages/MoneyVault";
import AdminLayout from "./layouts/AdminLayout";
import ProfitReport from "./ModeratorPages/ProfitReport";
import PersonalAccountStatement from "./ModeratorPages/PersonalAccountStatement";
import OwnerLayout from "./layouts/OwnerLayout";
import CustomersBalance from "./ModeratorPages/CustomersBalance";
import ClientBalanceInput from "./ModeratorPages/ClientBalanceInput";
import CreateOrders from "./components/CreateOrders";
const LoginRoute = () => {
  const { user } = useUserContext();
  console.log(user);
  if (user === null) {
    return <Login />;
  } else {
    if(user.user.msg.name === "Osama"){
      return <Navigate to="/up" /> 
    }
    else if (user.user.msg.name === "Ziad"){
      return <Navigate to="/admin" />
    }
    else if (user.user.msg.name === "Sobhy"){
      return <Navigate to="/owner" />
    }
    else if(user.user.msg.name === "Hassan"){
      return <Navigate to="/down" />
    }
    else{
      return <Login />;
    }
    
  }
};

const ModeratorRoute = () => {
  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.user.msg.name === "Osama" ? (
      <ModeratorLayout />
    ) : (
      <Navigate to="/" />
    );
  }
};

const WorkerRoute = () => {
  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.user.msg.name === "Hassan" ? (
      <HomeLayout />
    ) : (
      <Navigate to="/" />
    );
  }
};

const AdminRoute = () => {
  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.user.msg.name === "Ziad" ? (
      <AdminLayout />
    ) : (
      <Navigate to="/" />
    );
  }
};

const OwnerRoute = () => {
  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.user.msg.name === "Sobhy" ? (
      <OwnerLayout />
    ) : (
      <Navigate to="/" />
    );
  }
};

const router = createBrowserRouter([
  {
    path: "/down",
    element: <WorkerRoute />,
    children: [
      {
        index: true,
        element: <WorkerMainPage />,
      },
      {
        path: "impexp",
        element: <Impexp />,
      },
      {
        path: "day",
        element: <Day />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "finishedOrders",
        element: <FinishedOrders />,
      },
      {
        path: "createOrders",
        element: <CreateOrders />,
      },
    ],
  },
  {
    path: "/",
    element: <LoginRoute />,
  },
  {
    path: "/print/:isFinishedTicket/:id",
    element: <PrintLayout />,
    children: [
      {
        index: true,
        element: <ReceiptPrintPage />,
        loader: GetOrder,
      },
    ],
  },
  {
    path: "/print/purchasebill/:id",
    element: <PrintLayout />,
    children: [
      {
        index: true,
        element: <PurchaseBill />,
        loader: GetOrder,
      },
    ],
  },
  {
    path: "/up",
    element: <ModeratorRoute />,
    children: [
      {
        index: true,
        element: <ModeratorMainPage />,
      },
      {
        path: "orders/:category",
        element: <OrdersPage />,
      },
      {
        path: "clientbill",
        element: <ClientBill />,
      },
      {
        path: "moneyvault",
        element: <MoneyVault />,
      },
      {
        path: "personal-account-statement",
        element: <PersonalAccountStatement />,
      },
      {
        path: "impexp",
        element: <Impexp />,
      },
      {
        path: "day",
        element: <Day />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "customersbalance",
        element: <CustomersBalance />,
      }
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <ModeratorMainPage />,
      },
      {
        path: "orders/:category",
        element: <OrdersPage />,
      },
      {
        path: "clientbill",
        element: <ClientBill />,
      },
      {
        path: "moneyvault",
        element: <MoneyVault />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "personal-account-statement",
        element: <PersonalAccountStatement />,
      },
      {
        path: "impexp",
        element: <Impexp />,
      },
      {
        path: "day",
        element: <Day />,
      },
      {
        path: "profitreports",
        element: <ProfitReport />,
      },
      {
        path: "customersbalance",
        element: <CustomersBalance />,
      },
      {
        path: "clientbalance",
        element: <ClientBalanceInput />,
      }
    ],
  },
  {
    path: "/owner",
    element: <OwnerRoute />,
    children: [
      {
        index: true,
        element: <ModeratorMainPage />,
      },
      {
        path: "orders/:category",
        element: <OrdersPage />,
      },
      {
        path: "moneyvault",
        element: <MoneyVault />,
      },
      {
        path: "impexp",
        element: <Impexp />,
      },
      {
        path: "day",
        element: <Day />,
      },
      {
        path: "profitreports",
        element: <ProfitReport />,
      },
      {
        path: "customersbalance",
        element: <CustomersBalance />,
      },
      {
        path: "clientbill",
        element: <ClientBill />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
