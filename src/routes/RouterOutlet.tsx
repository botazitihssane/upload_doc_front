import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {lazy, Suspense} from "react";

const Dashboard = lazy(() => import('../pages/DashBoard'))
const Documents = lazy(() => import('../pages/Documents'))
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Dashboard/>}>
            <Route path='docs' element={<Documents/>}/>
        </Route>
    )
)

function RouterOutlet() {
    return <Suspense fallback={<h1>Loading...</h1>}>
        <RouterProvider router={router}/>
    </Suspense>
}

export default RouterOutlet