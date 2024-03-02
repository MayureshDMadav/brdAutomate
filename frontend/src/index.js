import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import HomePage from "./HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PdfCreator from "./components/pdfCreator";
import ErrorNotFound from "./components/errorNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorNotFound />,
  },
  {
    path: "/pdfCreator",
    element: <PdfCreator />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
