// notification.service.ts - Enhanced with sound unlock handling
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
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
  private checkInterval = 30000; // Check every 30 seconds
  private soundEnabled = false;
  private audio: HTMLAudioElement;

  constructor() {
    this.loadFromStorage();
    this.startAutoUpdates();

    // 🔊 Prepare audio element once
    this.audio = new Audio('assets/sound/notification.mp3');
    this.audio.load();

    // 🔓 Unlock sound after first user interaction
    document.addEventListener('click', this.enableSound.bind(this), { once: true });
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

    // 🔔 Play sound on new notification (if unlocked)
    this.playSound();

    // 🔴 Update favicon with unread count
    this.setFaviconWithCount(this.getUnreadCount());
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

  private enableSound(): void {
    this.soundEnabled = true;
    console.info('🔓 Sound unlocked by user interaction');
  }

  private playSound(): void {
    if (!this.soundEnabled) {
      console.warn('Sound blocked until user interacts with the page');
      return;
    }

    this.audio.currentTime = 0; // rewind
    this.audio.play().catch(err => {
      console.warn('Play failed:', err);
    });
  }

  private setFaviconWithCount(unreadCount: number): void {
    const link: HTMLLinkElement =
      (document.querySelector("link[rel='icon']") as HTMLLinkElement)
      || this.createFaviconTag();

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = `assets/favicon.png?cacheBust=${new Date().getTime()}`;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 64, 64);

      if (unreadCount > 0 && ctx) {
        // red circle badge
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(52, 12, 12, 0, 2 * Math.PI);
        ctx.fill();

        // number text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unreadCount.toString(), 52, 12);
      }

      link.href = canvas.toDataURL('image/png');
    };
  }

  // Helper to ensure favicon <link> exists
  private createFaviconTag(): HTMLLinkElement {
    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
    return link;
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

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // New method to simulate automatic status checking
  private startAutoUpdates(): void {
    interval(this.checkInterval)
      .pipe(
        startWith(0), // Start immediately
        switchMap(() => this.checkTransmissionStatuses())
      )
      .subscribe();
  }

  private checkTransmissionStatuses(): Observable<void> {
    return new Observable(observer => {
      // This would be where you call your API to check transmission statuses
      this.simulateStatusUpdates();
      observer.next();
      observer.complete();
    });
  }

  private simulateStatusUpdates(): void {
    const statuses = ['Completed', 'Failed', 'Processing'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    if (Math.random() > 0.7) { // 30% chance of a status update
      this.addNotification({
        type: randomStatus === 'Completed' ? 'success' :
              randomStatus === 'Failed' ? 'error' : 'info',
        message: `Transmission #${Math.floor(Math.random() * 1000)} ${randomStatus.toLowerCase()}`,
        transmissionId: Math.floor(Math.random() * 1000)
      });
    }
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
}
