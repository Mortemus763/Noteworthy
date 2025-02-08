import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import NotebookPage from '../components/NotebookPage/NoteBook';
import NotebookDetailsPage from '../components/NotebookDetailPage/NotebookDetailsPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "notebooks",
        element: <NotebookPage />,
      },
      {
        path: "/notebooks/:notebookId",  
        element: <NotebookDetailsPage />,
      },
    ],
  },
]);
