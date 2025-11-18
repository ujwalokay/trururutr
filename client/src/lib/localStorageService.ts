import type {
  Booking,
  FoodItem,
  Expense,
  DeviceConfig,
  PricingConfig,
  HappyHoursConfig,
  HappyHoursPricing,
} from "@shared/schema";

const STORAGE_KEYS = {
  BOOKINGS: "airavoto_demo_bookings",
  FOOD_ITEMS: "airavoto_demo_food_items",
  EXPENSES: "airavoto_demo_expenses",
  DEVICE_CONFIGS: "airavoto_demo_device_configs",
  PRICING_CONFIGS: "airavoto_demo_pricing_configs",
  HAPPY_HOURS_CONFIGS: "airavoto_demo_happy_hours_configs",
  HAPPY_HOURS_PRICING: "airavoto_demo_happy_hours_pricing",
  DEMO_INITIALIZED: "airavoto_demo_initialized",
} as const;

function generateId(): string {
  return crypto.randomUUID();
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
}

function seedDemoData() {
  const initialized = localStorage.getItem(STORAGE_KEYS.DEMO_INITIALIZED);
  if (initialized === "true") {
    return;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const demoDeviceConfigs: DeviceConfig[] = [
    {
      id: generateId(),
      category: "PC",
      count: 15,
      seats: Array.from({ length: 15 }, (_, i) => `PC ${i + 1}`),
    },
    {
      id: generateId(),
      category: "PS5",
      count: 8,
      seats: Array.from({ length: 8 }, (_, i) => `PS5 ${i + 1}`),
    },
  ];

  const demoPricingConfigs: PricingConfig[] = [
    { id: generateId(), category: "PC", duration: "30m", price: "30", personCount: 1 },
    { id: generateId(), category: "PC", duration: "1h", price: "50", personCount: 1 },
    { id: generateId(), category: "PC", duration: "2h", price: "90", personCount: 1 },
    { id: generateId(), category: "PC", duration: "3h", price: "130", personCount: 1 },
    { id: generateId(), category: "PC", duration: "6h", price: "240", personCount: 1 },
    { id: generateId(), category: "PS5", duration: "30m", price: "40", personCount: 1 },
    { id: generateId(), category: "PS5", duration: "1h", price: "70", personCount: 1 },
    { id: generateId(), category: "PS5", duration: "2h", price: "130", personCount: 1 },
    { id: generateId(), category: "PS5", duration: "3h", price: "180", personCount: 1 },
  ];

  const demoHappyHoursConfigs: HappyHoursConfig[] = [
    {
      id: generateId(),
      category: "PC",
      startTime: "14:00",
      endTime: "18:00",
      enabled: 1,
    },
    {
      id: generateId(),
      category: "PS5",
      startTime: "11:00",
      endTime: "14:00",
      enabled: 1,
    },
  ];

  const demoHappyHoursPricing: HappyHoursPricing[] = [
    { id: generateId(), category: "PC", duration: "1h", price: "40", personCount: 1 },
    { id: generateId(), category: "PC", duration: "2h", price: "70", personCount: 1 },
    { id: generateId(), category: "PS5", duration: "1h", price: "60", personCount: 1 },
  ];

  const demoFoodItems: FoodItem[] = [
    {
      id: generateId(),
      name: "Coca Cola",
      price: "30",
      costPrice: "15",
      currentStock: 50,
      minStockLevel: 20,
      inInventory: 100,
      category: "trackable",
      supplier: "Local Distributor",
      expiryDate: null,
    },
    {
      id: generateId(),
      name: "Pepsi",
      price: "30",
      costPrice: "15",
      currentStock: 45,
      minStockLevel: 20,
      inInventory: 90,
      category: "trackable",
      supplier: "Local Distributor",
      expiryDate: null,
    },
    {
      id: generateId(),
      name: "Potato Chips",
      price: "20",
      costPrice: "10",
      currentStock: 60,
      minStockLevel: 30,
      inInventory: 120,
      category: "trackable",
      supplier: "Snacks Supplier",
      expiryDate: null,
    },
    {
      id: generateId(),
      name: "Sandwich",
      price: "50",
      costPrice: null,
      currentStock: 0,
      minStockLevel: 10,
      inInventory: 0,
      category: "non_trackable",
      supplier: null,
      expiryDate: null,
    },
    {
      id: generateId(),
      name: "Energy Drink",
      price: "60",
      costPrice: "30",
      currentStock: 30,
      minStockLevel: 15,
      inInventory: 60,
      category: "trackable",
      supplier: "Beverage Supplier",
      expiryDate: null,
    },
  ];

  const demoBookings: Booking[] = [
    {
      id: generateId(),
      category: "PC",
      seatNumber: 5,
      seatName: "PC 5",
      customerName: "Demo Customer",
      whatsappNumber: "9876543210",
      startTime: new Date(today.getTime() + 10 * 3600 * 1000),
      endTime: new Date(today.getTime() + 12 * 3600 * 1000),
      price: "90",
      status: "running",
      bookingType: ["Regular"] as unknown as string[],
      pausedRemainingTime: null,
      personCount: 1,
      paymentMethod: null,
      cashAmount: null,
      upiAmount: null,
      paymentStatus: "unpaid",
      lastPaymentAction: null,
      foodOrders: [],
      originalPrice: null,
      discountApplied: null,
      bonusHoursApplied: null,
      promotionDetails: null,
      isPromotionalDiscount: 0,
      isPromotionalBonus: 0,
      manualDiscountPercentage: null,
      manualFreeHours: null,
      discount: null,
      bonus: null,
      createdAt: new Date(today.getTime() + 10 * 3600 * 1000),
    },
  ];

  const demoExpenses: Expense[] = [
    {
      id: generateId(),
      category: "Utilities",
      description: "Monthly electricity bill",
      amount: "5000",
      date: new Date(today.getTime() - 5 * 24 * 3600 * 1000),
      createdAt: new Date(today.getTime() - 5 * 24 * 3600 * 1000),
    },
    {
      id: generateId(),
      category: "Maintenance",
      description: "PC keyboard replacement",
      amount: "1500",
      date: new Date(today.getTime() - 2 * 24 * 3600 * 1000),
      createdAt: new Date(today.getTime() - 2 * 24 * 3600 * 1000),
    },
  ];

  saveToStorage(STORAGE_KEYS.DEVICE_CONFIGS, demoDeviceConfigs);
  saveToStorage(STORAGE_KEYS.PRICING_CONFIGS, demoPricingConfigs);
  saveToStorage(STORAGE_KEYS.HAPPY_HOURS_CONFIGS, demoHappyHoursConfigs);
  saveToStorage(STORAGE_KEYS.HAPPY_HOURS_PRICING, demoHappyHoursPricing);
  saveToStorage(STORAGE_KEYS.FOOD_ITEMS, demoFoodItems);
  saveToStorage(STORAGE_KEYS.BOOKINGS, demoBookings);
  saveToStorage(STORAGE_KEYS.EXPENSES, demoExpenses);
  localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, "true");
}

seedDemoData();

export const localStorageService = {
  getAllBookings(): Booking[] {
    return getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  },

  getBooking(id: string): Booking | undefined {
    const bookings = this.getAllBookings();
    return bookings.find((b) => b.id === id);
  },

  createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const bookings = this.getAllBookings();
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      createdAt: new Date(),
    };
    bookings.push(newBooking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  },

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bookings[index] = { ...bookings[index], ...updates };
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return bookings[index];
  },

  deleteBooking(id: string): boolean {
    const bookings = this.getAllBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    if (filtered.length === bookings.length) return false;

    saveToStorage(STORAGE_KEYS.BOOKINGS, filtered);
    return true;
  },

  getAllFoodItems(): FoodItem[] {
    return getFromStorage<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, []);
  },

  getFoodItem(id: string): FoodItem | undefined {
    const items = this.getAllFoodItems();
    return items.find((item) => item.id === id);
  },

  createFoodItem(item: Omit<FoodItem, "id">): FoodItem {
    const items = this.getAllFoodItems();
    const newItem: FoodItem = {
      ...item,
      id: generateId(),
    };
    items.push(newItem);
    saveToStorage(STORAGE_KEYS.FOOD_ITEMS, items);
    return newItem;
  },

  updateFoodItem(id: string, updates: Partial<FoodItem>): FoodItem | null {
    const items = this.getAllFoodItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    saveToStorage(STORAGE_KEYS.FOOD_ITEMS, items);
    return items[index];
  },

  deleteFoodItem(id: string): boolean {
    const items = this.getAllFoodItems();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;

    saveToStorage(STORAGE_KEYS.FOOD_ITEMS, filtered);
    return true;
  },

  getAllExpenses(): Expense[] {
    return getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  },

  createExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
    const expenses = this.getAllExpenses();
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date(),
    };
    expenses.push(newExpense);
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
  },

  updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const expenses = this.getAllExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) return null;

    expenses[index] = { ...expenses[index], ...updates };
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    return expenses[index];
  },

  deleteExpense(id: string): boolean {
    const expenses = this.getAllExpenses();
    const filtered = expenses.filter((e) => e.id !== id);
    if (filtered.length === expenses.length) return false;

    saveToStorage(STORAGE_KEYS.EXPENSES, filtered);
    return true;
  },

  getAllDeviceConfigs(): DeviceConfig[] {
    return getFromStorage<DeviceConfig[]>(STORAGE_KEYS.DEVICE_CONFIGS, []);
  },

  getDeviceConfig(category: string): DeviceConfig | undefined {
    const configs = this.getAllDeviceConfigs();
    return configs.find((c) => c.category === category);
  },

  saveDeviceConfig(config: Omit<DeviceConfig, "id">): DeviceConfig {
    const configs = this.getAllDeviceConfigs();
    const existingIndex = configs.findIndex((c) => c.category === config.category);

    if (existingIndex >= 0) {
      configs[existingIndex] = { ...configs[existingIndex], ...config };
      saveToStorage(STORAGE_KEYS.DEVICE_CONFIGS, configs);
      return configs[existingIndex];
    } else {
      const newConfig: DeviceConfig = {
        ...config,
        id: generateId(),
      };
      configs.push(newConfig);
      saveToStorage(STORAGE_KEYS.DEVICE_CONFIGS, configs);
      return newConfig;
    }
  },

  deleteDeviceConfig(category: string): boolean {
    const configs = this.getAllDeviceConfigs();
    const filtered = configs.filter((c) => c.category !== category);
    if (filtered.length === configs.length) return false;

    saveToStorage(STORAGE_KEYS.DEVICE_CONFIGS, filtered);
    return true;
  },

  getAllPricingConfigs(): PricingConfig[] {
    return getFromStorage<PricingConfig[]>(STORAGE_KEYS.PRICING_CONFIGS, []);
  },

  getPricingConfigsByCategory(category: string): PricingConfig[] {
    const configs = this.getAllPricingConfigs();
    return configs.filter((c) => c.category === category);
  },

  savePricingConfigs(category: string, configs: Omit<PricingConfig, "id">[]): PricingConfig[] {
    const allConfigs = this.getAllPricingConfigs();
    const filtered = allConfigs.filter((c) => c.category !== category);

    const newConfigs = configs.map((c) => ({
      ...c,
      id: generateId(),
    }));

    const updated = [...filtered, ...newConfigs];
    saveToStorage(STORAGE_KEYS.PRICING_CONFIGS, updated);
    return newConfigs;
  },

  deletePricingConfigsByCategory(category: string): boolean {
    const configs = this.getAllPricingConfigs();
    const filtered = configs.filter((c) => c.category !== category);
    if (filtered.length === configs.length) return false;

    saveToStorage(STORAGE_KEYS.PRICING_CONFIGS, filtered);
    return true;
  },

  getAllHappyHoursConfigs(): HappyHoursConfig[] {
    return getFromStorage<HappyHoursConfig[]>(STORAGE_KEYS.HAPPY_HOURS_CONFIGS, []);
  },

  getHappyHoursConfigsByCategory(category: string): HappyHoursConfig[] {
    const configs = this.getAllHappyHoursConfigs();
    return configs.filter((c) => c.category === category);
  },

  saveHappyHoursConfigs(
    category: string,
    configs: Omit<HappyHoursConfig, "id">[]
  ): HappyHoursConfig[] {
    const allConfigs = this.getAllHappyHoursConfigs();
    const filtered = allConfigs.filter((c) => c.category !== category);

    const newConfigs = configs.map((c) => ({
      ...c,
      id: generateId(),
    }));

    const updated = [...filtered, ...newConfigs];
    saveToStorage(STORAGE_KEYS.HAPPY_HOURS_CONFIGS, updated);
    return newConfigs;
  },

  deleteHappyHoursConfigsByCategory(category: string): boolean {
    const configs = this.getAllHappyHoursConfigs();
    const filtered = configs.filter((c) => c.category !== category);
    if (filtered.length === configs.length) return false;

    saveToStorage(STORAGE_KEYS.HAPPY_HOURS_CONFIGS, filtered);
    return true;
  },

  getAllHappyHoursPricing(): HappyHoursPricing[] {
    return getFromStorage<HappyHoursPricing[]>(STORAGE_KEYS.HAPPY_HOURS_PRICING, []);
  },

  getHappyHoursPricingByCategory(category: string): HappyHoursPricing[] {
    const pricing = this.getAllHappyHoursPricing();
    return pricing.filter((p) => p.category === category);
  },

  saveHappyHoursPricing(
    category: string,
    pricing: Omit<HappyHoursPricing, "id">[]
  ): HappyHoursPricing[] {
    const allPricing = this.getAllHappyHoursPricing();
    const filtered = allPricing.filter((p) => p.category !== category);

    const newPricing = pricing.map((p) => ({
      ...p,
      id: generateId(),
    }));

    const updated = [...filtered, ...newPricing];
    saveToStorage(STORAGE_KEYS.HAPPY_HOURS_PRICING, updated);
    return newPricing;
  },

  deleteHappyHoursPricingByCategory(category: string): boolean {
    const pricing = this.getAllHappyHoursPricing();
    const filtered = pricing.filter((p) => p.category !== category);
    if (filtered.length === pricing.length) return false;

    saveToStorage(STORAGE_KEYS.HAPPY_HOURS_PRICING, filtered);
    return true;
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  resetDemoData(): void {
    this.clearAllData();
    seedDemoData();
  },
};
