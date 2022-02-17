import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh, Detail } from '../cauhinh.types';
import { EditcauhinhComponent } from '../editcauhinh/editcauhinh.component';
import { ThuoctinhComponent } from '../thuoctinh/thuoctinh.component';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  Cauhinhs$: Observable<Cauhinh[]>;
  selectCauhinh:Cauhinh|null=null;
  ThisCauhinh: any;
  selectDetail:Detail[] =[];
  filter$: BehaviorSubject<string> = new BehaviorSubject('cauhinhs');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 4;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(   
   private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _CauhinhService: CauhinhService) { }
    detailChanged: Subject<Cauhinh> = new Subject<Cauhinh>();
    get filterStatus(): string
    {
        return this.filter$.value;
    }
    ngOnInit(): void
    {

     this.detailChanged.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            switchMap(selectCauhinh => this._CauhinhService.updateCauhinh(selectCauhinh)))
        .subscribe(() => {
            
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
        
        
      this._CauhinhService.getCauhinhs().subscribe();
      //this._CauhinhService.getDetails().subscribe();
      
      this.Cauhinhs$ = this._CauhinhService.Cauhinhs$;
       this._fuseMediaWatcherService.onMediaChange$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe(({matchingAliases}) => {

           // Set the drawerMode and drawerOpened if the given breakpoint is active
           if ( matchingAliases.includes('lg') )
           {
               this.drawerMode = 'side';
               this.drawerOpened = true;
           }
           else
           {
               this.drawerMode = 'over';
               this.drawerOpened = false;
           }

           // Set the masonry columns
           //
           // This if block structured in a way so that only the
           // biggest matching alias will be used to set the column
           // count.
           if ( matchingAliases.includes('xl') )
           {
               this.masonryColumns = 1;
           }
           else if ( matchingAliases.includes('lg') )
           {
               this.masonryColumns = 1;
           }
           else if ( matchingAliases.includes('md') )
           {
               this.masonryColumns = 1;
           }
           else if ( matchingAliases.includes('sm') )
           {
               this.masonryColumns = 1;
           }
           else
           {
               this.masonryColumns = 1;
           }

           // Mark for check
           this._changeDetectorRef.markForCheck();
       });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    openNoteDialog(detail: Detail): void
    {
        this._matDialog.open(ThuoctinhComponent, {
            autoFocus: false,
            data     : {
                note: cloneDeep(detail)
            }
        });
    }
    openEditDialog(): void
    {
        this._matDialog.open(EditcauhinhComponent, {autoFocus: false});
    }
    addDetailToCauhinh(cauhinh: Cauhinh, thuoctinh: string): void
    {
        cauhinh.detail[uuidv4()] = thuoctinh;
        // if (thuoctinh)
        // {
        //     return;
        // }
        this._CauhinhService.updateCauhinh(cauhinh).subscribe();
    }
    removeThuoctinh(selectCauhinh: Cauhinh, thuoctinh: object): void
    {
        delete selectCauhinh.detail[thuoctinh['key']]
        this.detailChanged.next(selectCauhinh);
    }
    updateThuoctinh(selectCauhinh: Cauhinh, thuoctinh: object): void
    {
       selectCauhinh.detail[thuoctinh['key']] = thuoctinh['value']
       this.detailChanged.next(selectCauhinh);
    }
    ChosenCauhinh(id: string): void
    {

        this._CauhinhService.selectCauhinh(id)
            .subscribe((cauhinh) => {
               this.selectCauhinh = cauhinh;
                //this.selectDetail = cauhinh.detail;
                this._changeDetectorRef.markForCheck();
            });
    }

    filterByArchived(): void
     {
         this.filter$.next('archived');
     }
     filterByLabel(labelId: string): void
     {
         
         const filterValue = `item:${labelId}`;
         this.filter$.next(filterValue);
     }
     filterByQuery(query: string): void
     {
         this.searchQuery$.next(query);
     }
     resetFilter(): void
     {
         this.filter$.next('details');
     }
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
  
}
