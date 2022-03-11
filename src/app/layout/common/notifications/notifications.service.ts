import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { NotificationEntity } from 'app/layout/common/notifications/notifications.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService
{
    private _notifications: ReplaySubject<NotificationEntity[]> = new ReplaySubject<NotificationEntity[]>(1);
    constructor(
        private _httpClient: HttpClient,
        )
    {
    }
    get notifications$(): Observable<NotificationEntity[]>
    {
        return this._notifications.asObservable();
    }
    getAll(): Observable<NotificationEntity[]>
    {
        return this._httpClient.get<NotificationEntity[]>(`${environment.ApiURL}/notification`).pipe(
            tap((notifications) => {
                this._notifications.next(notifications);
            })
        );
    }
    create(notification): Observable<any>
    {
        return this._httpClient.post(`${environment.ApiURL}/notification`,notification).pipe(
            tap((response: any) => {
              this._notifications.next(response);

            })
        );
    }
    update(notification: NotificationEntity): Observable<NotificationEntity>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.patch<NotificationEntity>(`${environment.ApiURL}/notification/${notification.id}`,notification).pipe(
                map((updatedNotification: NotificationEntity) => {
                    const index = notifications.findIndex(item => item.id === notification.id);
                    notifications[index] = updatedNotification;
                    this._notifications.next(notifications);
                    return updatedNotification;
                })
            ))
        );
    }
    delete(id: string): Observable<boolean>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>(`${environment.ApiURL}/notification/${id}`).pipe(
                map((isDeleted: boolean) => {
                    const index = notifications.findIndex(item => item.id === id);
                    notifications.splice(index, 1);
                    this._notifications.next(notifications);
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Mark all notifications as read
     */
    // markAllAsRead(): Observable<boolean>
    // {
    //     return this.notifications$.pipe(
    //         take(1),
    //         switchMap(notifications => this._httpClient.get<boolean>('api/common/notifications/mark-all-as-read').pipe(
    //             map((isUpdated: boolean) => {

    //                 // Go through all notifications and set them as read
    //                 notifications.forEach((notification, index) => {
    //                     notifications[index].read = true;
    //                 });

    //                 // Update the notifications
    //                 this._notifications.next(notifications);

    //                 // Return the updated status
    //                 return isUpdated;
    //             })
    //         ))
    //     );
    // }
}
