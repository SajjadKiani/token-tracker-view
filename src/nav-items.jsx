import { HomeIcon, SearchIcon, BookmarkIcon, UserIcon, WalletIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Search from "./pages/Search.jsx";
import Bookmark from "./pages/Bookmark.jsx";
import Login from "./pages/Login.jsx";
import Wallet from "./pages/Wallet.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Search",
    to: "/search",
    icon: <SearchIcon className="h-4 w-4" />,
    page: <Search />,
  },
  {
    title: "Bookmark",
    to: "/bookmark",
    icon: <BookmarkIcon className="h-4 w-4" />,
    page: <Bookmark />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Login />,
  },
  {
    title: "Wallet",
    to: "/wallet",
    icon: <WalletIcon className="h-4 w-4" />,
    page: <Wallet />,
  },
];
