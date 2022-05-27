import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { NotificationEntity } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { SwPush } from '@angular/service-worker';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    sub: PushSubscription;
    readonly VAPID_PUBLIC_KEY = "BJe-03OtBqwjGbpangu282m8R_E5qtjanOUANBF-ID37Fq-V2hZoOJ5hZJlW0qeXt0prcfIsu63gNQ_xmXPCE3M";

    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;
    notifications: NotificationEntity[];
    unreadCount: number = 0;
    User:User;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _userService: UserService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private swPush: SwPush,
    )
    {
    }
    ngOnInit(): void
    {   
        this.subscribeToNotifications();   
        this._userService.user$.subscribe((data)=>this.User=data)
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: NotificationEntity[]) => {
                this.notifications = notifications.filter(v=>v.idTo==this.User.id);
                this._calculateUnreadCount();
                this._changeDetectorRef.markForCheck();
            });
    }
    subscribeToNotifications() {
      this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => {
           const data = {idUser:this.User.id,Subscription:sub}
            this.sub = sub;  
            console.log("Notification Subscription: ", sub);
            this._notificationsService.addPushSubscriber(data).subscribe(
                () => console.log('Sent push subscription object to server.'),
                err =>  console.log('Could not send subscription object to server, reason: ', err)
            );
        })
        .catch(err => console.error("Could not subscribe to notifications", err));
    }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }
    openPanel(): void
    {
        if ( !this._notificationsPanel || !this._notificationsOrigin )
        {
            return;
        }
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }
    closePanel(): void
    {
        this._overlayRef.detach();
    }
    markAllAsRead(): void
    {
        this.notifications.forEach(v => {
            v.Status = true;
            this._notificationsService.update(v).subscribe();
        });
    }

    toggleRead(notification: NotificationEntity): void
    {
        notification.Status = !notification.Status;
        this._notificationsService.update(notification).subscribe();
    }
    delete(notification: NotificationEntity): void
    {
        this._notificationsService.delete(notification.id).subscribe();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    private _createOverlay(): void
    {
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
    private _calculateUnreadCount(): void
    {
        let count = 0;
        if ( this.notifications && this.notifications.length )
        {
            count = this.notifications.filter(notification => !notification.Status).length;
        }
        this.unreadCount = count;
    }
}
