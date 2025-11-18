import type { Booking, InsertBooking, DeviceConfig, PricingConfig } from "@shared/schema";
import { localStorageService } from "./localStorageService";

export async function fetchBookings(): Promise<Booking[]> {
  return Promise.resolve(localStorageService.getAllBookings());
}

export async function createBooking(booking: InsertBooking): Promise<Booking> {
  const newBooking = localStorageService.createBooking(booking);
  return Promise.resolve(newBooking);
}

export async function updateBooking(id: string, data: Partial<InsertBooking>): Promise<Booking> {
  const updated = localStorageService.updateBooking(id, data);
  if (!updated) {
    throw new Error("Booking not found");
  }
  return Promise.resolve(updated);
}

export async function deleteBooking(id: string): Promise<void> {
  const deleted = localStorageService.deleteBooking(id);
  if (!deleted) {
    throw new Error("Booking not found");
  }
  return Promise.resolve();
}

export async function fetchDeviceConfigs(): Promise<DeviceConfig[]> {
  return Promise.resolve(localStorageService.getAllDeviceConfigs());
}

export async function fetchPricingConfigs(): Promise<PricingConfig[]> {
  return Promise.resolve(localStorageService.getAllPricingConfigs());
}

export async function getServerTime(): Promise<Date> {
  return Promise.resolve(new Date());
}
