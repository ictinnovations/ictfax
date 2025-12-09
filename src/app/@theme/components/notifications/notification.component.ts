import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from './notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount = 0;
  isOpen = false;
  filter: 'all' | 'unread' | 'read' = 'all';
  private notificationSubscription: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationSubscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
        this.unreadCount = this.notificationService.getUnreadCount();
        this.applyFilter(this.filter);
      });
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  toggleNotifications() {
    this.isOpen = !this.isOpen;
  }

  applyFilter(filter: 'all' | 'unread' | 'read') {
    this.filter = filter;
    if (filter === 'all') {
      this.filteredNotifications = this.notifications;
    } else if (filter === 'unread') {
      this.filteredNotifications = this.notifications.filter(n => !n.read);
    } else if (filter === 'read') {
      this.filteredNotifications = this.notifications.filter(n => n.read);
    }
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }

  markFilteredAsRead() {
    this.filteredNotifications
      .filter(n => !n.read)
      .forEach(n => this.notificationService.markAsRead(n.id));
  }

  clearAll() {
    this.notificationService.clearAll();
  }

  hasUnreadFiltered(): boolean {
    return this.filteredNotifications.some(n => !n.read);
  }

  hasAnyNotifications(): boolean {
    return this.notifications.length > 0;
  }
}
