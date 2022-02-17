import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Observable, Subject, takeUntil, debounceTime, filter, switchMap } from 'rxjs';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh } from '../cauhinh.types';

@Component({
  selector: 'app-editcauhinh',
  templateUrl: './editcauhinh.component.html',
  styleUrls: ['./editcauhinh.component.scss']
})
export class EditcauhinhComponent implements OnInit {
  cauhinhs$: Observable<Cauhinh[]>;
  cauhinh$: Observable<Cauhinh>;
  cauhinhChanged: Subject<Cauhinh> = new Subject<Cauhinh>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _cauhinhsService: CauhinhService,
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
  {
      // Get the cauhinhs
      this.cauhinhs$ = this._cauhinhsService.Cauhinhs$;

      // Subscribe to cauhinh updates
      this.cauhinhChanged
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(500),
              filter(cauhinh => cauhinh.title.trim() !== ''),
              switchMap(cauhinh => this._cauhinhsService.updateCauhinh(cauhinh)))
          .subscribe(() => {
                
              // Mark for check
              this._changeDetectorRef.markForCheck();
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  addCauhinh(title: string): void
  {
      this._cauhinhsService.addCauhinh(title).subscribe();
  }

  /**
   * Update cauhinh
   */
  updateCauhinh(cauhinh: Cauhinh): void
  {
      console.log(cauhinh);
      this.cauhinhChanged.next(cauhinh);
  }

  /**
   * Delete cauhinh
   *
   * @param id
   */
  deleteCauhinh(cauhinh: Cauhinh): void
  {
      this._cauhinhsService.deleteCauhinh(cauhinh).subscribe(() => {
          this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

}
