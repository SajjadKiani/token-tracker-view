import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import BottomNavbar from "./components/BottomNavbar";
import TokenDetails from "./pages/TokenDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { SupabaseAuthProvider, useSupabaseAuth } from "./integrations/supabase";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { session } = useSupabaseAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {navItems.map(({ to, page }) => (
        <Route 
          key={to} 
          path={to} 
          element={
            <ProtectedRoute>
              {page}
            </ProtectedRoute>
          } 
        />
      ))}
      <Route 
        path="/token/:chainId/:tokenAddress" 
        element={
          <ProtectedRoute>
            <TokenDetails />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
        <BrowserRouter>
          <SupabaseAuthProvider>
            <div className="pb-16">
              <AppRoutes />
            </div>
            <BottomNavbar />
          </SupabaseAuthProvider>
        </BrowserRouter>
      </TonConnectUIProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
