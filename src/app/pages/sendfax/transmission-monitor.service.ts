// // transmission-monitor.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { interval, Observable } from 'rxjs';
// import { startWith, switchMap, catchError } from 'rxjs/operators';
// import { NotificationService } from './notification.service';
// import {AppService} from '../../../app/app.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class TransmissionMonitorService {
//   private checkInterval = 30000; // Check every 30 seconds
//   private monitoredTransmissions: Set<number> = new Set();

//   constructor(
//     private http: HttpClient,
//     private notificationService: NotificationService,
//     private appService: AppService
//   ) {}

//   startMonitoring(): void {
//     interval(this.checkInterval)
//       .pipe(
//         startWith(0),
//         switchMap(() => this.checkAllTransmissions())
//       )
//       .subscribe();
//   }

//   monitorTransmission(transmissionId: number): void {
//     this.monitoredTransmissions.add(transmissionId);
//     this.checkTransmissionStatus(transmissionId).subscribe();
//   }

//   private checkAllTransmissions(): Observable<void> {
//     return new Observable(observer => {
//       if (this.monitoredTransmissions.size === 0) {
//         observer.next();
//         observer.complete();
//         return;
//       }

//       const transmissionIds = Array.from(this.monitoredTransmissions);
//       this.checkTransmissionsStatus(transmissionIds).subscribe(() => {
//         observer.next();
//         observer.complete();
//       });
//     });
//   }

//   private checkTransmissionsStatus(transmissionIds: number[]): Observable<any> {
//     const headers = new HttpHeaders();
//     this.appService.createAuthorizationHeader(headers);

//     // This would be your API endpoint to check multiple transmissions
//     const url = `${this.appService.apiUrlTransmission}/status?ids=${transmissionIds.join(',')}`;

//     return this.http.get(url, { headers }).pipe(
//       catchError(error => {
//         console.error('Error checking transmission status:', error);
//         return [];
//       })
//     );
//   }

//   private checkTransmissionStatus(transmissionId: number): Observable<any> {
//     const headers = new HttpHeaders();
//     this.appService.createAuthorizationHeader(headers);

//     const url = `${this.appService.apiUrlTransmission}/${transmissionId}/status`;

//     return this.http.get(url, { headers }).pipe(
//       catchError(error => {
//         console.error('Error checking transmission status:', error);
//         return [];
//       })
//     );
//   }

//   removeFromMonitoring(transmissionId: number): void {
//     this.monitoredTransmissions.delete(transmissionId);
//   }
// }
