// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
  transmissionId?: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private storageKey = 'fax_notifications';

  constructor() {
    this.loadFromStorage();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notificationsSubject.next([...this.notifications]);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    this.notificationsSubject.next([...this.notifications]);
  }

  clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
    this.notificationsSubject.next([]);
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.notificationsSubject.next([...this.notifications]);
      }
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
