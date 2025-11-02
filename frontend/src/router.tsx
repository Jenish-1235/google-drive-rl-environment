import { createBrowserRouter, Navigate } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage/WelcomePage";
import { SharedPage } from "./pages/SharedPage/SharedPage";
import { RecentPage } from "./pages/RecentPage/RecentPage";
import { StarredPage } from "./pages/StarredPage/StarredPage";
import { TrashPage } from "./pages/TrashPage/TrashPage";
import { StoragePage } from "./pages/StoragePage/StoragePage";
import { ComputersPage } from "./pages/ComputersPage/ComputersPage";
import { SharedDrivesPage } from "./pages/SharedDrivesPage/SharedDrivesPage";
import { SpamPage } from "./pages/SpamPage/SpamPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { ROUTES } from "./utils/constants";
import { MainLayout } from "./components/layout/MainLayout";
import { HomePage } from "./pages/HomePage/HomePage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <AuthPage mode="login" />,
      },
      {
        path: "signup",
        element: <AuthPage mode="signup" />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: <WelcomePage />,
      },
      {
        path: "drive",
        element: <HomePage />,
      },
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "shared-drives",
        element: <SharedDrivesPage />,
      },
      {
        path: "computers",
        element: <ComputersPage />,
      },
      {
        path: "shared",
        element: <SharedPage />,
      },
      {
        path: "recent",
        element: <RecentPage />,
      },
      {
        path: "starred",
        element: <StarredPage />,
      },
      {
        path: "spam",
        element: <SpamPage />,
      },
      {
        path: "trash",
        element: <TrashPage />,
      },
      {
        path: "storage",
        element: <StoragePage />,
      },
      {
        path: "folder/:folderId",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
