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
  Vitri:any;
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
        this.Vitri = {"eceb6560-47b2-480f-b876-857e48f7d723":"CEO","4aebb23f-0009-4765-8616-2ec0bc3bf721":"Front End","d9dfcd17-3bdb-4ef7-9675-336e33d0592b":"SEO","30941412-66c5-4676-8862-7de27aa86c85":"Leader IT"};
        this.vetuyendungs$ = this._VetuyendungService.vetuyendungs$;
        this._VetuyendungService.vetuyendungs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vetuyendungs: Vetuyendung[]) => {
                // vetuyendungs.forEach(item => {
                //     item.Vitri = this.Vitri[item.idVitri]
                // });
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
        const idVitri = this.vetuyendungs[0].idVitri;
     if(!idVitri)
        {
            this._notifierService.notify('error', 'Có Phiếu Mới Chưa Điền');
            
        }
        else {
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
