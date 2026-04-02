import { useState } from "react";
import { useCloudStore } from "@/lib/cloud-store";
import { CloudProvider, StorageType } from "@/lib/cloud-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const STORAGE_TYPES: StorageType[] = ["SSD", "HDD", "Archive"];
const COST_PER_GB: Record<StorageType, number> = { SSD: 0.10, HDD: 0.04, Archive: 0.01 };

export function CreateStorageDialog() {
  const addStorageResource = useCloudStore((s) => s.addStorageResource);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [type, setType] = useState<StorageType>("SSD");
  const [sizeGB, setSizeGB] = useState("100");

  const costPerGB = COST_PER_GB[type];
  const size = Math.max(1, Math.min(10000, parseInt(sizeGB) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      toast.error("Name must be 1–50 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      toast.error("Name can only contain letters, numbers, hyphens, underscores");
      return;
    }
    if (size < 1 || size > 10000) {
      toast.error("Size must be 1–10,000 GB");
      return;
    }
    addStorageResource({ name: trimmed, provider, type, allocatedGB: size, costPerGB });
    toast.success(`Provisioned ${trimmed} (${size}GB ${type}) on ${provider}`);
    setName("");
    setSizeGB("100");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> New Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provision Storage Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="st-name">Name</Label>
            <Input id="st-name" placeholder="my-bucket" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as CloudProvider)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AWS">AWS</SelectItem>
                  <SelectItem value="Azure">Azure</SelectItem>
                  <SelectItem value="GCP">GCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as StorageType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STORAGE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="st-size">Size (GB)</Label>
            <Input id="st-size" type="number" min={1} max={10000} value={sizeGB} onChange={(e) => setSizeGB(e.target.value)} />
          </div>
          <div className="rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground">
            Estimated cost: <span className="font-mono font-semibold text-foreground">${(costPerGB * size).toFixed(2)}/mo</span> ({type} @ ${costPerGB}/GB)
          </div>
          <Button type="submit" className="w-full">Provision Storage</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
