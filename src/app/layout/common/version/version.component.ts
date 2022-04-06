import { BooleanInput } from '@angular/cdk/coercion';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationEntity } from 'app/layout/common/notifications/notifications.types';
import { environment } from 'environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { VersionService } from './version.service';
import { UserService } from 'app/core/user/user.service';
@Component({
    selector: 'app-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;
    notifications: NotificationEntity[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    VerForm: FormGroup;
    Changelogs: any;
    Changelog: any;
    ThisUser: any;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _versionService: VersionService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _userService: UserService,
        private _formbuilder: FormBuilder
    ) {
    }
    version = environment.version;
    public Editor = InlineEditor;
    public config = {
        placeholder: 'Vui lòng nhập nội dung'
    };
    ngOnInit(): void {
        this._versionService.getAllChanglog().subscribe();
        this._versionService.changelogs$.pipe(takeUntil(this._unsubscribeAll)).subscribe
            ((res) => { this.Changelogs = res; })
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe
            ((res) => { this.ThisUser = res; })

        this.VerForm = this._formbuilder.group({
            Version: [''],
            Noidung: ['']
        })
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: NotificationEntity[]) => {
                this.notifications = notifications;
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }
    CreateChangelog(): void {
        const changelog = this.VerForm.getRawValue();
        this._versionService.CreateChanglog(changelog).subscribe();
        this.VerForm.reset();
        this._changeDetectorRef.markForCheck();
    }
    EditChangelog(item): void {
       this.VerForm.patchValue(item);+
       this._changeDetectorRef.markForCheck();
    }
    UpdateChangelog(): void {
        const changelog = this.VerForm.getRawValue();
        this._versionService.UpdateChangelog(changelog).subscribe();
        this.VerForm.reset();
        this._changeDetectorRef.markForCheck();
    }
    openPanel(): void {
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }
        if (!this._overlayRef) {
            this._createOverlay();
        }
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }
    closePanel(): void {
        this._overlayRef.detach();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    private _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])
        });
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
}
