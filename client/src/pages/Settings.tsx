import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceConfigCard } from "@/components/DeviceConfigCard";
import { PricingTable } from "@/components/PricingTable";
import { HappyHoursPricing } from "@/components/HappyHoursPricing";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { localStorageService } from "@/lib/localStorageService";
import type { DeviceConfig, PricingConfig, HappyHoursConfig, HappyHoursPricing as HappyHoursPricingType } from "@shared/schema";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export default function Settings() {
  const { toast } = useToast();
  
  // Local state for device configs
  const [pcConfig, setPcConfig] = useState({ count: 30, seats: [] as { name: string; visible: boolean }[] });
  const [ps5Config, setPs5Config] = useState({ count: 20, seats: [] as { name: string; visible: boolean }[] });

  // Local state for pricing
  const [pcPricing, setPcPricing] = useState<{ duration: string; price: number; personCount?: number }[]>([]);
  const [ps5Pricing, setPs5Pricing] = useState<{ duration: string; price: number; personCount?: number }[]>([]);

  // Local state for happy hours time slots
  const [pcHappyHoursEnabled, setPcHappyHoursEnabled] = useState(true);
  const [ps5HappyHoursEnabled, setPs5HappyHoursEnabled] = useState(true);
  const [pcTimeSlots, setPcTimeSlots] = useState<TimeSlot[]>([]);
  const [ps5TimeSlots, setPs5TimeSlots] = useState<TimeSlot[]>([]);

  // Local state for happy hours pricing
  const [pcHappyHoursPricing, setPcHappyHoursPricing] = useState<{ duration: string; price: number; personCount?: number }[]>([]);
  const [ps5HappyHoursPricing, setPs5HappyHoursPricing] = useState<{ duration: string; price: number; personCount?: number }[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = () => {
    const deviceConfigs = localStorageService.getAllDeviceConfigs();
    const pricingConfigs = localStorageService.getAllPricingConfigs();
    const happyHoursConfigs = localStorageService.getAllHappyHoursConfigs();
    const happyHoursPricing = localStorageService.getAllHappyHoursPricing();

    // Load device configs
    const pc = deviceConfigs.find((c) => c.category === "PC");
    const ps5 = deviceConfigs.find((c) => c.category === "PS5");

    if (pc) {
      setPcConfig({
        count: pc.count,
        seats: pc.seats.map((name) => ({ name, visible: true })),
      });
    }

    if (ps5) {
      setPs5Config({
        count: ps5.count,
        seats: ps5.seats.map((name) => ({ name, visible: true })),
      });
    }

    // Load pricing configs
    const pcConfigs = pricingConfigs.filter((c) => c.category === "PC");
    const ps5Configs = pricingConfigs.filter((c) => c.category === "PS5");

    setPcPricing(pcConfigs.map((c) => ({ duration: c.duration, price: parseFloat(c.price), personCount: c.personCount })));
    setPs5Pricing(ps5Configs.map((c) => ({ duration: c.duration, price: parseFloat(c.price), personCount: c.personCount })));

    // Load happy hours configs
    const pcHHConfigs = happyHoursConfigs.filter((c) => c.category === "PC");
    const ps5HHConfigs = happyHoursConfigs.filter((c) => c.category === "PS5");

    setPcHappyHoursEnabled(pcHHConfigs.length > 0 && pcHHConfigs[0].enabled === 1);
    setPs5HappyHoursEnabled(ps5HHConfigs.length > 0 && ps5HHConfigs[0].enabled === 1);

    setPcTimeSlots(pcHHConfigs.map((c) => ({ startTime: c.startTime, endTime: c.endTime })));
    setPs5TimeSlots(ps5HHConfigs.map((c) => ({ startTime: c.startTime, endTime: c.endTime })));

    // Load happy hours pricing
    const pcHHPricing = happyHoursPricing.filter((c) => c.category === "PC");
    const ps5HHPricing = happyHoursPricing.filter((c) => c.category === "PS5");

    setPcHappyHoursPricing(pcHHPricing.map((c) => ({ duration: c.duration, price: parseFloat(c.price), personCount: c.personCount })));
    setPs5HappyHoursPricing(ps5HHPricing.map((c) => ({ duration: c.duration, price: parseFloat(c.price), personCount: c.personCount })));
  };

  const handleSaveAll = () => {
    try {
      // Save device configs
      localStorageService.saveDeviceConfig({
        category: "PC",
        count: pcConfig.count,
        seats: pcConfig.seats.map((s) => s.name),
      });

      localStorageService.saveDeviceConfig({
        category: "PS5",
        count: ps5Config.count,
        seats: ps5Config.seats.map((s) => s.name),
      });

      // Save pricing configs
      localStorageService.savePricingConfigs("PC", pcPricing.map((c) => ({
        category: "PC",
        duration: c.duration,
        price: c.price.toString(),
        personCount: c.personCount || 1,
      })));

      localStorageService.savePricingConfigs("PS5", ps5Pricing.map((c) => ({
        category: "PS5",
        duration: c.duration,
        price: c.price.toString(),
        personCount: c.personCount || 1,
      })));

      // Save happy hours configs
      localStorageService.saveHappyHoursConfigs("PC", (pcTimeSlots.length > 0 ? pcTimeSlots : [{ startTime: "11:00", endTime: "14:00" }])
        .map((slot) => ({ category: "PC", startTime: slot.startTime, endTime: slot.endTime, enabled: pcHappyHoursEnabled ? 1 : 0 })));

      localStorageService.saveHappyHoursConfigs("PS5", (ps5TimeSlots.length > 0 ? ps5TimeSlots : [{ startTime: "11:00", endTime: "14:00" }])
        .map((slot) => ({ category: "PS5", startTime: slot.startTime, endTime: slot.endTime, enabled: ps5HappyHoursEnabled ? 1 : 0 })));

      // Save happy hours pricing if exists
      if (pcHappyHoursPricing.length > 0) {
        localStorageService.saveHappyHoursPricing("PC", pcHappyHoursPricing.map((c) => ({
          category: "PC",
          duration: c.duration,
          price: c.price.toString(),
          personCount: c.personCount || 1,
        })));
      }

      if (ps5HappyHoursPricing.length > 0) {
        localStorageService.saveHappyHoursPricing("PS5", ps5HappyHoursPricing.map((c) => ({
          category: "PS5",
          duration: c.duration,
          price: c.price.toString(),
          personCount: c.personCount || 1,
        })));
      }

      toast({
        title: "Settings Saved",
        description: "All configurations have been saved successfully!",
      });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save some settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePcCountChange = (newCount: number) => {
    const newSeats = Array.from({ length: newCount }, (_, i) => ({
      name: `PC-${i + 1}`,
      visible: i < pcConfig.seats.length ? pcConfig.seats[i].visible : true,
    }));
    setPcConfig({ count: newCount, seats: newSeats });
  };

  const handlePs5CountChange = (newCount: number) => {
    const newSeats = Array.from({ length: newCount }, (_, i) => ({
      name: `PS5-${i + 1}`,
      visible: i < ps5Config.seats.length ? ps5Config.seats[i].visible : true,
    }));
    setPs5Config({ count: newCount, seats: newSeats });
  };

  const handlePcToggleVisibility = (seatName: string) => {
    setPcConfig((prev) => ({
      ...prev,
      seats: prev.seats.map((s) => (s.name === seatName ? { ...s, visible: !s.visible } : s)),
    }));
  };

  const handlePs5ToggleVisibility = (seatName: string) => {
    setPs5Config((prev) => ({
      ...prev,
      seats: prev.seats.map((s) => (s.name === seatName ? { ...s, visible: !s.visible } : s)),
    }));
  };

  const addPcTimeSlot = () => {
    setPcTimeSlots([...pcTimeSlots, { startTime: "11:00", endTime: "14:00" }]);
  };

  const addPs5TimeSlot = () => {
    setPs5TimeSlots([...ps5TimeSlots, { startTime: "11:00", endTime: "14:00" }]);
  };

  const removePcTimeSlot = (index: number) => {
    setPcTimeSlots(pcTimeSlots.filter((_, i) => i !== index));
  };

  const removePs5TimeSlot = (index: number) => {
    setPs5TimeSlots(ps5TimeSlots.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-settings-title">Settings</h1>
          <p className="text-muted-foreground">Configure devices and pricing</p>
        </div>
        <Button onClick={handleSaveAll} data-testid="button-save-changes">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Device Configuration */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Device Configuration</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <DeviceConfigCard
            title="PC"
            description={`Configure PC devices`}
            count={pcConfig.count}
            onCountChange={handlePcCountChange}
            seats={pcConfig.seats}
            onToggleVisibility={handlePcToggleVisibility}
          />
          <DeviceConfigCard
            title="PS5"
            description={`Configure PS5 devices`}
            count={ps5Config.count}
            onCountChange={handlePs5CountChange}
            seats={ps5Config.seats}
            onToggleVisibility={handlePs5ToggleVisibility}
          />
        </div>
      </div>

      {/* Pricing Configuration */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pricing Configuration</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>PC Pricing</CardTitle>
              <CardDescription>Set pricing for PC gaming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <PricingTable
                category="PC"
                slots={pcPricing}
                onUpdateSlots={setPcPricing}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PS5 Pricing</CardTitle>
              <CardDescription>Set pricing for PS5 gaming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <PricingTable
                category="PS5"
                slots={ps5Pricing}
                onUpdateSlots={setPs5Pricing}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Happy Hours Configuration */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Happy Hours Configuration</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* PC Happy Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>PC Happy Hours</CardTitle>
                  <CardDescription>Configure discount time slots for PC</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={pcHappyHoursEnabled}
                    onCheckedChange={setPcHappyHoursEnabled}
                    data-testid="switch-pc-happy-hours"
                  />
                  <Label htmlFor="pc-happy-hours-enabled" className="text-sm">
                    {pcHappyHoursEnabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pcTimeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => {
                      const updated = [...pcTimeSlots];
                      updated[index].startTime = e.target.value;
                      setPcTimeSlots(updated);
                    }}
                    data-testid={`input-pc-happy-hours-start-${index}`}
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => {
                      const updated = [...pcTimeSlots];
                      updated[index].endTime = e.target.value;
                      setPcTimeSlots(updated);
                    }}
                    data-testid={`input-pc-happy-hours-end-${index}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePcTimeSlot(index)}
                    data-testid={`button-remove-pc-timeslot-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addPcTimeSlot} variant="outline" data-testid="button-add-pc-timeslot">
                Add Time Slot
              </Button>
            </CardContent>
          </Card>

          {/* PS5 Happy Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>PS5 Happy Hours</CardTitle>
                  <CardDescription>Configure discount time slots for PS5</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ps5HappyHoursEnabled}
                    onCheckedChange={setPs5HappyHoursEnabled}
                    data-testid="switch-ps5-happy-hours"
                  />
                  <Label htmlFor="ps5-happy-hours-enabled" className="text-sm">
                    {ps5HappyHoursEnabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ps5TimeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => {
                      const updated = [...ps5TimeSlots];
                      updated[index].startTime = e.target.value;
                      setPs5TimeSlots(updated);
                    }}
                    data-testid={`input-ps5-happy-hours-start-${index}`}
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => {
                      const updated = [...ps5TimeSlots];
                      updated[index].endTime = e.target.value;
                      setPs5TimeSlots(updated);
                    }}
                    data-testid={`input-ps5-happy-hours-end-${index}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePs5TimeSlot(index)}
                    data-testid={`button-remove-ps5-timeslot-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addPs5TimeSlot} variant="outline" data-testid="button-add-ps5-timeslot">
                Add Time Slot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Happy Hours Pricing */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Happy Hours Pricing</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>PC Happy Hours Pricing</CardTitle>
              <CardDescription>Special pricing during PC happy hours</CardDescription>
            </CardHeader>
            <CardContent>
              <HappyHoursPricing
                category="PC"
                slots={pcHappyHoursPricing}
                onUpdateSlots={setPcHappyHoursPricing}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PS5 Happy Hours Pricing</CardTitle>
              <CardDescription>Special pricing during PS5 happy hours</CardDescription>
            </CardHeader>
            <CardContent>
              <HappyHoursPricing
                category="PS5"
                slots={ps5HappyHoursPricing}
                onUpdateSlots={setPs5HappyHoursPricing}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
