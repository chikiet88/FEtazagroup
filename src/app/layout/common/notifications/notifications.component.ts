import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { NotificationEntity } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    notifications: NotificationEntity[];
    unreadCount: number = 0;
    User:User;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _userService: UserService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {        this._userService.user$.subscribe((data)=>this.User=data)
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: NotificationEntity[]) => {
                this.notifications = notifications.filter(v=>v.idTo==this.User.id);
                this._calculateUnreadCount();
                this._changeDetectorRef.markForCheck();
            });
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
    // markAllAsRead(): void
    // {
    //     this._notificationsService.markAllAsRead().subscribe();
    // }

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
