import type { Booking, InsertBooking, DeviceConfig, PricingConfig } from "@shared/schema";

export async function fetchBookings(): Promise<Booking[]> {
  const response = await fetch('/api/bookings', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);
  }
  return response.json();
}

export async function createBooking(booking: InsertBooking): Promise<Booking> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(booking),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create booking');
  }
  
  return response.json();
}

export async function updateBooking(id: string, data: Partial<InsertBooking>): Promise<Booking> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update booking');
  }
  
  return response.json();
}

export async function deleteBooking(id: string): Promise<void> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete booking');
  }
}

export async function fetchDeviceConfigs(): Promise<DeviceConfig[]> {
  const response = await fetch('/api/device-config', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch device configs: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPricingConfigs(): Promise<PricingConfig[]> {
  const response = await fetch('/api/pricing-config', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch pricing configs: ${response.statusText}`);
  }
  return response.json();
}

export async function getServerTime(): Promise<Date> {
  const response = await fetch('/api/server-time', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch server time: ${response.statusText}`);
  }
  const data = await response.json();
  return new Date(data.time);
}
