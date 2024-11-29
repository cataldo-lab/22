import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import NotasPage from './pages/NotasPage';
import ProtectedRoute from '@components/ProtectedRoute';
import CalificacionesPage from './pages/CalificacionesPage';
import ListaAlumnoPage from './pages/ListaAlumnoPage';
import '@styles/styles.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        ),
    },
    {
      path: '/notas', // Nueva ruta para Notas
      element: (
        <ProtectedRoute allowedRoles={['alumno']}>
          <NotasPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/calificaciones",
      element: (
          <ProtectedRoute allowedRoles={["profesor"]}>
              <CalificacionesPage />
          </ProtectedRoute>
      ),
    },
    {
      path: '/lista-alumnos', // Ruta para ListaAlumnoPage
      element: (
        <ProtectedRoute allowedRoles={['profesor']}>
          <ListaAlumnoPage />
        </ProtectedRoute>
      ),
    }


    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)