import { CloudProvider } from "@/lib/cloud-types";
import { useCloudStore } from "@/lib/cloud-store";
import { cn } from "@/lib/utils";
import { Cloud, Server, HardDrive } from "lucide-react";

const providerIcons: Record<CloudProvider, typeof Cloud> = {
  AWS: Cloud,
  Azure: Server,
  GCP: HardDrive,
};

const providerColors: Record<CloudProvider, string> = {
  AWS: "text-aws",
  Azure: "text-azure",
  GCP: "text-gcp",
};

const tabs: (CloudProvider | "All")[] = ["All", "AWS", "Azure", "GCP"];

export function ProviderTabs() {
  const { selectedProvider, setSelectedProvider } = useCloudStore();

  return (
    <div className="flex gap-1 rounded-xl bg-muted/60 backdrop-blur-sm p-1 border border-border/40">
      {tabs.map((tab) => {
        const active = selectedProvider === tab;
        const Icon = tab !== "All" ? providerIcons[tab] : null;
        return (
          <button
            key={tab}
            onClick={() => setSelectedProvider(tab)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              active
                ? "bg-card text-foreground shadow-sm shadow-black/20 border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {Icon && <Icon className={cn("h-3.5 w-3.5", active && tab !== "All" ? providerColors[tab] : "")} />}
            <span>{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
