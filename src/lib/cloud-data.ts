import { VM, StorageResource, Database, CloudProvider } from "./cloud-types";

let idCounter = 100;
const nextId = () => `res-${++idCounter}`;

export const initialVMs: VM[] = [
  { id: nextId(), name: "web-server-1", provider: "AWS", status: "running", cpu: 4, ram: 16, costPerHour: 0.17 },
  { id: nextId(), name: "api-server", provider: "AWS", status: "running", cpu: 8, ram: 32, costPerHour: 0.34 },
  { id: nextId(), name: "batch-worker", provider: "AWS", status: "stopped", cpu: 16, ram: 64, costPerHour: 0.68 },
  { id: nextId(), name: "app-vm-01", provider: "Azure", status: "running", cpu: 4, ram: 16, costPerHour: 0.19 },
  { id: nextId(), name: "ml-training", provider: "Azure", status: "stopped", cpu: 32, ram: 128, costPerHour: 1.52 },
  { id: nextId(), name: "dev-instance", provider: "Azure", status: "running", cpu: 2, ram: 8, costPerHour: 0.10 },
  { id: nextId(), name: "compute-01", provider: "GCP", status: "running", cpu: 8, ram: 32, costPerHour: 0.31 },
  { id: nextId(), name: "data-pipeline", provider: "GCP", status: "running", cpu: 16, ram: 64, costPerHour: 0.62 },
  { id: nextId(), name: "staging-vm", provider: "GCP", status: "stopped", cpu: 2, ram: 8, costPerHour: 0.08 },
];

export const initialStorage: StorageResource[] = [
  { id: nextId(), name: "s3-primary", provider: "AWS", type: "SSD", allocatedGB: 500, usedGB: 342, costPerGB: 0.023 },
  { id: nextId(), name: "s3-archive", provider: "AWS", type: "Archive", allocatedGB: 2000, usedGB: 1580, costPerGB: 0.004 },
  { id: nextId(), name: "blob-main", provider: "Azure", type: "SSD", allocatedGB: 400, usedGB: 289, costPerGB: 0.020 },
  { id: nextId(), name: "blob-cold", provider: "Azure", type: "HDD", allocatedGB: 1000, usedGB: 670, costPerGB: 0.010 },
  { id: nextId(), name: "gcs-bucket", provider: "GCP", type: "SSD", allocatedGB: 600, usedGB: 410, costPerGB: 0.020 },
  { id: nextId(), name: "gcs-nearline", provider: "GCP", type: "Archive", allocatedGB: 1500, usedGB: 980, costPerGB: 0.010 },
];

export const initialDatabases: Database[] = [
  { id: nextId(), name: "rds-postgres", provider: "AWS", engine: "PostgreSQL", status: "active", sizeGB: 100, costPerHour: 0.24 },
  { id: nextId(), name: "dynamodb-main", provider: "AWS", engine: "DynamoDB", status: "active", sizeGB: 50, costPerHour: 0.13 },
  { id: nextId(), name: "sql-server-01", provider: "Azure", engine: "SQL Server", status: "active", sizeGB: 200, costPerHour: 0.45 },
  { id: nextId(), name: "cosmos-db", provider: "Azure", engine: "CosmosDB", status: "inactive", sizeGB: 80, costPerHour: 0.30 },
  { id: nextId(), name: "cloud-sql", provider: "GCP", engine: "MySQL", status: "active", sizeGB: 150, costPerHour: 0.28 },
  { id: nextId(), name: "firestore-main", provider: "GCP", engine: "Firestore", status: "active", sizeGB: 30, costPerHour: 0.10 },
];

export const providerColors: Record<CloudProvider, string> = {
  AWS: "aws",
  Azure: "azure",
  GCP: "gcp",
};

export const providerLabels: Record<CloudProvider, string> = {
  AWS: "Amazon Web Services",
  Azure: "Microsoft Azure",
  GCP: "Google Cloud Platform",
};
