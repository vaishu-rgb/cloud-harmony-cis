import { ProviderTabs } from "@/components/ProviderTabs";
import { OverviewCards } from "@/components/OverviewCards";
import { VMTable } from "@/components/VMTable";
import { StoragePanel } from "@/components/StoragePanel";
import { DatabasePanel } from "@/components/DatabasePanel";
import { UsageLogs } from "@/components/UsageLogs";
import { CostAnalytics } from "@/components/CostAnalytics";
import { BudgetAlert } from "@/components/BudgetAlert";
import { Cloud, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen grid-bg">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <Cloud className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight gradient-text">CloudSim</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Multi-Cloud Simulation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
              <Zap className="h-3 w-3" />
              Live
            </div>
            <ProviderTabs />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-6 py-6">
        <OverviewCards />
        
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BudgetAlert />
          </div>
          <div className="lg:col-span-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-5 flex-1 flex flex-col justify-center"
            >
              <p className="section-title mb-2">Quick Stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avg. Cost per VM</span>
                  <span className="font-mono text-sm font-semibold text-foreground">$0.42/hr</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Storage Efficiency</span>
                  <span className="font-mono text-sm font-semibold text-primary">71%</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Uptime</span>
                  <span className="font-mono text-sm font-semibold text-success">99.9%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div>
          <p className="section-title mb-3">Analytics</p>
          <CostAnalytics />
        </div>

        <div>
          <p className="section-title mb-3">Compute</p>
          <VMTable />
        </div>

        <div>
          <p className="section-title mb-3">Infrastructure</p>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <StoragePanel />
            <DatabasePanel />
          </div>
        </div>

        <div>
          <p className="section-title mb-3">Activity</p>
          <UsageLogs />
        </div>
      </main>

      <footer className="border-t border-border/40 py-6">
        <p className="text-center text-[11px] text-muted-foreground">
          CloudSim Dashboard · Simulated multi-cloud environment
        </p>
      </footer>
    </div>
  );
};

export default Index;
