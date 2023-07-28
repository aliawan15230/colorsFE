import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ColorDetails from "./components/ColorDetails";
import ColorListComponent from "./components/ColorListComponent";
import UsersColorDetails from "./components/UsersColorDetails";

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <ColorListComponent/>,
        },
        {
            path: "admin/details/:id",
            element: <ColorDetails/>
        },
        {
            path: "user/details/:id",
            element: <UsersColorDetails/>
        }
    ]);

    return (
        <>
            <RouterProvider router={router}/>
        </>
    );
}

export default App;
