import { create } from "zustand";
import { VM, StorageResource, Database, UsageLog, CloudProvider, ProviderSummary } from "./cloud-types";
import { initialVMs, initialStorage, initialDatabases } from "./cloud-data";

let logId = 0;

let vmCounter = 100;
let storageCounter = 100;

interface CloudStore {
  vms: VM[];
  storage: StorageResource[];
  databases: Database[];
  logs: UsageLog[];
  selectedProvider: CloudProvider | "All";
  sessionCost: number;
  sessionStarted: number;
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;
  setSelectedProvider: (p: CloudProvider | "All") => void;
  startVM: (id: string) => void;
  stopVM: (id: string) => void;
  addVM: (vm: Omit<VM, "id" | "status">) => void;
  addStorageResource: (st: Omit<StorageResource, "id" | "usedGB">) => void;
  allocateStorage: (id: string, additionalGB: number) => void;
  toggleDatabase: (id: string) => void;
  addLog: (log: Omit<UsageLog, "id" | "timestamp">) => void;
  tickSessionCost: () => void;
  getSummary: () => ProviderSummary[];
}

export const useCloudStore = create<CloudStore>((set, get) => ({
  vms: initialVMs,
  storage: initialStorage,
  databases: initialDatabases,
  logs: [],
  selectedProvider: "All",
  sessionCost: 0,
  sessionStarted: Date.now(),
  budgetLimit: 10,

  setBudgetLimit: (limit) => set({ budgetLimit: limit }),
  setSelectedProvider: (p) => set({ selectedProvider: p }),

  tickSessionCost: () => {
    const { vms, databases } = get();
    const hourlyRate =
      vms.filter((v) => v.status === "running").reduce((a, v) => a + v.costPerHour, 0) +
      databases.filter((d) => d.status === "active").reduce((a, d) => a + d.costPerHour, 0);
    // Each tick represents ~3 seconds of simulated time scaled to 1 hour = 1 minute for visible movement
    const increment = hourlyRate * (3 / 60);
    set((s) => ({ sessionCost: s.sessionCost + increment }));
  },

  addLog: (log) =>
    set((s) => ({
      logs: [{ ...log, id: `log-${++logId}`, timestamp: new Date() }, ...s.logs].slice(0, 200),
    })),

  startVM: (id) => {
    set((s) => ({
      vms: s.vms.map((vm) => (vm.id === id && vm.status === "stopped" ? { ...vm, status: "running" } : vm)),
    }));
    const vm = get().vms.find((v) => v.id === id);
    if (vm) get().addLog({ provider: vm.provider, action: "START VM", resource: vm.name, details: `Started ${vm.name} (${vm.cpu} vCPU, ${vm.ram}GB RAM)` });
  },

  addVM: (vm) => {
    const id = `vm-${++vmCounter}`;
    const newVM: VM = { ...vm, id, status: "stopped" };
    set((s) => ({ vms: [...s.vms, newVM] }));
    get().addLog({ provider: vm.provider, action: "PROVISION VM", resource: vm.name, details: `Provisioned ${vm.name} (${vm.cpu} vCPU, ${vm.ram}GB RAM) on ${vm.provider}` });
  },

  addStorageResource: (st) => {
    const id = `st-${++storageCounter}`;
    const newSt: StorageResource = { ...st, id, usedGB: 0 };
    set((s) => ({ storage: [...s.storage, newSt] }));
    get().addLog({ provider: st.provider, action: "PROVISION STORAGE", resource: st.name, details: `Provisioned ${st.name} (${st.allocatedGB}GB ${st.type}) on ${st.provider}` });
  },

  stopVM: (id) => {
    set((s) => ({
      vms: s.vms.map((vm) => (vm.id === id && vm.status === "running" ? { ...vm, status: "stopped" } : vm)),
    }));
    const vm = get().vms.find((v) => v.id === id);
    if (vm) get().addLog({ provider: vm.provider, action: "STOP VM", resource: vm.name, details: `Stopped ${vm.name}` });
  },

  allocateStorage: (id, additionalGB) => {
    set((s) => ({
      storage: s.storage.map((st) => (st.id === id ? { ...st, allocatedGB: st.allocatedGB + additionalGB } : st)),
    }));
    const st = get().storage.find((s) => s.id === id);
    if (st) get().addLog({ provider: st.provider, action: "ALLOCATE STORAGE", resource: st.name, details: `Added ${additionalGB}GB to ${st.name} (total: ${st.allocatedGB}GB)` });
  },

  toggleDatabase: (id) => {
    set((s) => ({
      databases: s.databases.map((db) =>
        db.id === id ? { ...db, status: db.status === "active" ? "inactive" : "active" } : db
      ),
    }));
    const db = get().databases.find((d) => d.id === id);
    if (db) get().addLog({ provider: db.provider, action: db.status === "active" ? "ACTIVATE DB" : "DEACTIVATE DB", resource: db.name, details: `${db.name} (${db.engine}) is now ${db.status}` });
  },

  getSummary: () => {
    const { vms, storage, databases } = get();
    const providers: CloudProvider[] = ["AWS", "Azure", "GCP"];
    return providers.map((p) => {
      const pVMs = vms.filter((v) => v.provider === p);
      const pSt = storage.filter((s) => s.provider === p);
      const pDb = databases.filter((d) => d.provider === p);
      return {
        provider: p,
        totalVMs: pVMs.length,
        runningVMs: pVMs.filter((v) => v.status === "running").length,
        totalStorageGB: pSt.reduce((a, s) => a + s.allocatedGB, 0),
        usedStorageGB: pSt.reduce((a, s) => a + s.usedGB, 0),
        totalDatabases: pDb.length,
        activeDatabases: pDb.filter((d) => d.status === "active").length,
        monthlyCost:
          pVMs.filter((v) => v.status === "running").reduce((a, v) => a + v.costPerHour * 730, 0) +
          pSt.reduce((a, s) => a + s.allocatedGB * s.costPerGB, 0) +
          pDb.filter((d) => d.status === "active").reduce((a, d) => a + d.costPerHour * 730, 0),
      };
    });
  },
}));
