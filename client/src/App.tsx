/**
 * App.tsx — SolLaunch Router
 * Design: Dark Solana Native
 * Routes: Home, CreateToken, LiquidityPool, ManageLiquidity, Support
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WalletProvider } from "./contexts/WalletContext";
import Home from "./pages/Home";
import CreateToken from "./pages/CreateToken";
import LiquidityPool from "./pages/LiquidityPool";
import ManageLiquidity from "./pages/ManageLiquidity";
import Support from "./pages/Support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create-token" component={CreateToken} />
      <Route path="/liquidity-pool" component={LiquidityPool} />
      <Route path="/manage-liquidity" component={ManageLiquidity} />
      <Route path="/support" component={Support} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <WalletProvider>
          <TooltipProvider>
            <Toaster position="top-right" theme="dark" />
            <Router />
          </TooltipProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
