import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Note, Label } from '../../apps/notes/notes.types';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh, Detail } from '../cauhinh.types';

@Component({
  selector: 'app-thuoctinh',
  templateUrl: './thuoctinh.component.html',
  styleUrls: ['./thuoctinh.component.scss']
})
export class ThuoctinhComponent implements OnInit {
  cauhinh$: Observable<Cauhinh>;
  details$: Observable<Detail[]>;
  cauhinhChanged: Subject<Cauhinh> = new Subject<Cauhinh>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) private _data: { cauhinh: Cauhinh },
      private _cauhinhService: CauhinhService,
      private _matDialogRef: MatDialogRef<ThuoctinhComponent>
  )
  {
  }
  ngOnInit(): void
  {
      // if ( this._data.cauhinh.id )
      // {
      //     this._cauhinhService.getCauhinhById(this._data.cauhinh.id).subscribe();
      //     this.cauhinh$ = this._cauhinhService.Cauhinhs$;
      // }
      // else
      // {
      //     const cauhinh = {
      //         id       : null,
      //         title    : '',
      //         content  : '',
      //         tasks    : null,
      //         image    : null,
      //         reminder : null,
      //         labels   : [],
      //         archived : false,
      //         createdAt: null,
      //         updatedAt: null
      //     };
      //     this.cauhinh$ = of(cauhinh);
      // }
      // this.details$ = this._cauhinhService.Details$;
      // this.cauhinhChanged
      //     .pipe(
      //         takeUntil(this._unsubscribeAll),
      //         debounceTime(500),
      //         switchMap(cauhinh => this._cauhinhService.updateCauhinh(cauhinh)))
      //     .subscribe(() => {
      //         this._changeDetectorRef.markForCheck();
      //     });
  }
  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }


}
