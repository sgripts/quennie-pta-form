import SignIn from './components/SignIn';
import EntryForm from './components/EntryForm';
import PrivateRoute from "./components/PrivateRoute";
import PocketBaseContext from './components/PocketBaseContext';
import PocketBase from 'pocketbase';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
const pb = new PocketBase('https://quennie-pta.pockethost.io/');
const gradeLevels = await pb.collection('GradeLevels').getFullList({
    sort: 'created',
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute element={<EntryForm />} />,
    },
    {
      path: '/form',
      element: <PrivateRoute element={<EntryForm />} />,
    },
    {
        path: '/login',
        element: <SignIn />
    }
]);

function App() {
  return (
    <>
        <PocketBaseContext.Provider value={{ pb, gradeLevels }}>
            <div className="container mx-auto p-2 min-h-dvh flex flex-col items-center justify-center gap-8">
                <h1 className="text-xl font-bold">PTA Record Form</h1>
                <RouterProvider router={router} />
            </div>
        </PocketBaseContext.Provider>
    </>
  )
}

export default App
