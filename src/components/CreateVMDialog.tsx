import { useState } from "react";
import { useCloudStore } from "@/lib/cloud-store";
import { CloudProvider } from "@/lib/cloud-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CPU_OPTIONS = [1, 2, 4, 8, 16];
const RAM_OPTIONS = [2, 4, 8, 16, 32, 64];
const COST_MAP: Record<number, number> = { 1: 0.05, 2: 0.10, 4: 0.17, 8: 0.34, 16: 0.68 };

export function CreateVMDialog() {
  const addVM = useCloudStore((s) => s.addVM);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<CloudProvider>("AWS");
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(8);

  const costPerHour = COST_MAP[cpu] ?? 0.10;

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
    addVM({ name: trimmed, provider, cpu, ram, costPerHour });
    toast.success(`Provisioned ${trimmed} on ${provider}`);
    setName("");
    setCpu(2);
    setRam(8);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> New VM
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provision Virtual Machine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vm-name">Name</Label>
            <Input id="vm-name" placeholder="my-server" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>vCPUs</Label>
              <Select value={String(cpu)} onValueChange={(v) => setCpu(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CPU_OPTIONS.map((c) => <SelectItem key={c} value={String(c)}>{c} vCPU</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>RAM (GB)</Label>
              <Select value={String(ram)} onValueChange={(v) => setRam(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RAM_OPTIONS.map((r) => <SelectItem key={r} value={String(r)}>{r} GB</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground">
            Estimated cost: <span className="font-mono font-semibold text-foreground">${costPerHour}/hr</span> · <span className="font-mono">${(costPerHour * 730).toFixed(0)}/mo</span>
          </div>
          <Button type="submit" className="w-full">Provision VM</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
