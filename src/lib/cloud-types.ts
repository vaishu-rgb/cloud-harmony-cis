export type CloudProvider = "AWS" | "Azure" | "GCP";

export type VMStatus = "running" | "stopped" | "terminated";
export type StorageType = "SSD" | "HDD" | "Archive";

export interface VM {
  id: string;
  name: string;
  provider: CloudProvider;
  status: VMStatus;
  cpu: number;
  ram: number; // GB
  costPerHour: number;
}

export interface StorageResource {
  id: string;
  name: string;
  provider: CloudProvider;
  type: StorageType;
  allocatedGB: number;
  usedGB: number;
  costPerGB: number;
}

export interface Database {
  id: string;
  name: string;
  provider: CloudProvider;
  engine: string;
  status: "active" | "inactive";
  sizeGB: number;
  costPerHour: number;
}

export interface UsageLog {
  id: string;
  timestamp: Date;
  provider: CloudProvider;
  action: string;
  resource: string;
  details: string;
}

export interface ProviderSummary {
  provider: CloudProvider;
  totalVMs: number;
  runningVMs: number;
  totalStorageGB: number;
  usedStorageGB: number;
  totalDatabases: number;
  activeDatabases: number;
  monthlyCost: number;
}
