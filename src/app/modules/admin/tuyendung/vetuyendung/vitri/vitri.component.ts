import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Vitri } from '../vetuyendung';
import { VetuyendungService } from '../vetuyendung.service';

@Component({
  selector: 'app-vitri',
  templateUrl: './vitri.component.html',
  styleUrls: ['./vitri.component.scss']
})
export class VitriComponent implements OnInit {

  vitris$: Observable<Vitri[]>;
  vitriChanged: Subject<Vitri> = new Subject<Vitri>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _vestuyendungService: VetuyendungService
  )
  {
  }

  ngOnInit(): void
  {
      this.vitris$ = this._vestuyendungService.vitris$;
      this.vitriChanged
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(500),
              filter(vitri => vitri.Thuoctinh.trim() !== ''),
              switchMap(vitri => this._vestuyendungService.updateVitri(vitri)))
          .subscribe(() => {
              this._changeDetectorRef.markForCheck();
          });
  }
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  addVitri(title: string): void
  {
      this._vestuyendungService.addVitri(title).subscribe();
  }
  updateVitri(Vitri: Vitri): void
  {
      this.vitriChanged.next(Vitri);
  }
  deleteVitri(id: string): void
  {
      this._vestuyendungService.deleteVitri(id).subscribe(() => {
          this._changeDetectorRef.markForCheck();
      });
  }
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
