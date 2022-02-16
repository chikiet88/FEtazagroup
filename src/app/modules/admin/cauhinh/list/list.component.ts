import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { combineLatest, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh } from '../cauhinh.types';
import { EditcauhinhComponent } from '../editcauhinh/editcauhinh.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  Cauhinhs$: Observable<Cauhinh[]> ;
  masonryColumns: number = 4;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(   
   private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _CauhinhService: CauhinhService) { }
    ngOnInit(): void
    {
      this._CauhinhService.getCauhinhs().subscribe();
      
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
               this.masonryColumns = 5;
           }
           else if ( matchingAliases.includes('lg') )
           {
               this.masonryColumns = 4;
           }
           else if ( matchingAliases.includes('md') )
           {
               this.masonryColumns = 3;
           }
           else if ( matchingAliases.includes('sm') )
           {
               this.masonryColumns = 2;
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
    openEditDialog(): void
    {
        this._matDialog.open(EditcauhinhComponent, {autoFocus: false});
    }

  
}

