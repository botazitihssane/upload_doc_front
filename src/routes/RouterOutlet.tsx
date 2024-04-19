import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const SignIn = lazy(() => import("../Register/SignIn"));
const Login = lazy(() => import("../Register/Login"));

const Documents = lazy(() => import("../pages/Documents"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SignIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="docs" element={<Documents />} />
    </>
  )
);

function RouterOutlet() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default RouterOutlet;
