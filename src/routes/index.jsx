import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import DocumentDetail from "../pages/home/document-detail";
import NotFound from "../pages/not-found";

const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/documents",
    element: <Home />,
    children: [
      {
        path: ":id",
        element: <DocumentDetail />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const App = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route, i) => (
          <Route key={`route${i}`} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((child, j) => (
                <Route
                  key={`child${j}`}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
};

export default App;
