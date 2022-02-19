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
  vetuyendungsCount: number = 0;
  drawerMode: 'over' | 'side';
  searchInputControl: FormControl = new FormControl();
  constructor(    

    @Inject(DOCUMENT) private _document: any,   
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _VetuyendungService: VetuyendungService
    
    ) { }

    ngOnInit(): void
    {
        this._VetuyendungService.getVetuyendungs().subscribe();
        this.vetuyendungs$ = this._VetuyendungService.vetuyendungs$;
        this._VetuyendungService.vetuyendungs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vetuyendungs: Vetuyendung[]) => {
                if(vetuyendungs)
                {
                this.vetuyendungsCount = vetuyendungs.length;
                }
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
        this._VetuyendungService.createVetuyendung().subscribe((newVe) => {
            console.log(newVe);
            this._router.navigate(['./', newVe.uuid], {relativeTo: this._activatedRoute});
            this._changeDetectorRef.markForCheck();
        });
    }    
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
