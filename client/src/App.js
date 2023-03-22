import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./components/Root/Root";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Connections from "./components/Connections/Connections";
import Chat from "./components/Chat/Chat";
import Home from "./components/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "connections",
        element: <Connections />,
      },
      { path: "chat/:id", element: <Chat /> },
    ],
  },
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
