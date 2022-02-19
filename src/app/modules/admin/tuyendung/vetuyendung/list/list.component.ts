import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { Vetuyendung} from '../vetuyendung.types';
import { VetuyendungService } from '../vetuyendung.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
 contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
 selectedVetuyendung: Vetuyendung;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  vetuyendungs$: Observable<Vetuyendung[]>;
  vetuyendungs: Vetuyendung[];
  vetuyendungsCount: number = 0;
  drawerMode: 'over' | 'side';
  searchInputControl: FormControl = new FormControl();

  constructor(    

    @Inject(DOCUMENT) private _document: any,   
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _VetuyendungService: VetuyendungService,
    private _notifierService: NotifierService,
    ) { }

    ngOnInit(): void
    {
        this.vetuyendungs$ = this._VetuyendungService.vetuyendungs$;
        this._VetuyendungService.vetuyendungs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vetuyendungs: Vetuyendung[]) => {
                console.log(vetuyendungs)
                this.vetuyendungsCount = vetuyendungs.length;
                this.vetuyendungs = vetuyendungs;
                this._changeDetectorRef.markForCheck();
            });

            this.matDrawer.openedChange.subscribe((opened) => {
                if ( !opened )
                {
                    this.selectedVetuyendung = null;
                    this._changeDetectorRef.markForCheck();
                }
            });            
            this._fuseMediaWatcherService.onMediaChange$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(({matchingAliases}) => {
                    if ( matchingAliases.includes('lg') )
                    {
                        this.drawerMode = 'side';
                    }
                    else
                    {
                        this.drawerMode = 'over';
                    }
        
                    this._changeDetectorRef.markForCheck();
                });

    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }
    createYeucau(): void
    {
    if(this.vetuyendungs.length==0)
       { this._VetuyendungService.createVetuyendung().subscribe((newVe) => {
            this._router.navigate(['./', newVe.id], {relativeTo: this._activatedRoute});
            this._changeDetectorRef.markForCheck();
         });
    }
    else
    {
        const Vitri = this.vetuyendungs[0].Vitri;
     if(!Vitri)
        {
            this._notifierService.notify('error', 'Có Phiếu Trống Chưa Điền');
            
        }
        else {
            this._notifierService.notify('success', 'Tạo mới');
            this._VetuyendungService.createVetuyendung().subscribe((newVe) => {
                this._router.navigate(['./', newVe.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
        });   
        }
    }

    }    
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
