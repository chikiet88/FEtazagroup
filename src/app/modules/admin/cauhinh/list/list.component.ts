import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh } from '../cauhinh.types';
import { EditcauhinhComponent } from '../editcauhinh/editcauhinh.component';
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class ListComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  Cauhinhs$: Observable<Cauhinh[]>;
  selectCauhinh:Cauhinh|null=null;
  ThisCauhinh: any;
  filter$: BehaviorSubject<string> = new BehaviorSubject('cauhinhs');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 4;
  Cauhinh:any;
  Thuoctinh:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(   
   private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _CauhinhService: CauhinhService,
    private _snackBar: MatSnackBar
    ) { }
    detailChanged: Subject<Cauhinh> = new Subject<Cauhinh>();
    get filterStatus(): string
    {
        return this.filter$.value;
    }
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
    }

    ngOnInit(): void
    {
     this.detailChanged.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            switchMap(selectCauhinh => this._CauhinhService.updateCauhinh(selectCauhinh)))
        .subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
      this._CauhinhService.getCauhinhs().subscribe();     
      this.Cauhinhs$ = this._CauhinhService.Cauhinhs$;
       this._fuseMediaWatcherService.onMediaChange$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe(({matchingAliases}) => {
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

            this.Cauhinh = {
                "id": "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d",
                "title": "Phòng",
                "detail": {},
                "Trangthai": 0,
                "Ordering": 0,
                "Ngaytao": "2022-03-02T03:16:41.749Z",
                "idTao": 0
            }
            this.Thuoctinh = [
                {
                    "id": 1,
                    "Thuoctinh": "Ban Tổng Giám Đốc",
                    "$$hashKey": "object:506"
                },
                {
                    "id": 2,
                    "Thuoctinh": "Ban điều hành",
                    "$$hashKey": "object:507"
                },
                {
                    "id": 3,
                    "Thuoctinh": "QTRR và KSNB",
                    "$$hashKey": "object:508"
                },
                {
                    "id": 4,
                    "Thuoctinh": "QTN Nhân lực",
                    "$$hashKey": "object:509"
                },
                {
                    "Thuoctinh": "Tài chính kế toán",
                    "id": 5,
                    "$$hashKey": "object:510"
                },
                {
                    "Thuoctinh": "Kinh doanh Taza",
                    "id": 6,
                    "$$hashKey": "object:511"
                },
                {
                    "Thuoctinh": "Marketing",
                    "id": 7,
                    "$$hashKey": "object:512"
                },
                {
                    "Thuoctinh": "Sale online",
                    "id": 8,
                    "$$hashKey": "object:513"
                },
                {
                    "id": 9,
                    "Thuoctinh": "CSKH/QC",
                    "$$hashKey": "object:514"
                },
                {
                    "id": 10,
                    "Thuoctinh": "Kinh doanh Sharyn",
                    "$$hashKey": "object:515"
                },
                {
                    "id": 11,
                    "Thuoctinh": "Kinh doanh Timona",
                    "$$hashKey": "object:516"
                },
                {
                    "id": 12,
                    "Thuoctinh": "Giáo vụ",
                    "$$hashKey": "object:517"
                },
                {
                    "id": 13,
                    "Thuoctinh": "Hội đồng chuyên môn",
                    "$$hashKey": "object:518"
                },
                {
                    "id": 14,
                    "Thuoctinh": "Đào Tạo",
                    "$$hashKey": "object:519"
                },
                {
                    "$$hashKey": "object:534",
                    "id": 15,
                    "Thuoctinh": "Hỗ trợ"
                }
            ]
          //this.ImportDetailToCauhinh(this.Cauhinh,this.Thuoctinh);


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
    addDetailToCauhinh(cauhinh: Cauhinh, thuoctinh: string): void
    {

        cauhinh.detail[uuidv4()] = thuoctinh;
        this._CauhinhService.updateCauhinh(cauhinh).subscribe();
    }
    ImportDetailToCauhinh(cauhinh: Cauhinh, thuoctinh: any): void
    {
        thuoctinh.forEach(v => {
            cauhinh.detail[uuidv4()] = v.Thuoctinh;
            this._CauhinhService.updateCauhinh(cauhinh).subscribe(); 
        });

    }
    removeThuoctinh(selectCauhinh: Cauhinh, thuoctinh: object): void
    {
        delete selectCauhinh.detail[thuoctinh['key']]
        this.detailChanged.next(selectCauhinh);
    }
    updateThuoctinh(selectCauhinh: Cauhinh, thuoctinh: object): void
    {
        console.log(thuoctinh);
       selectCauhinh.detail[thuoctinh['key']] = thuoctinh['value']
       this.detailChanged.next(selectCauhinh);
    }
    ChosenCauhinh(id: string): void
    {

        this._CauhinhService.selectCauhinh(id)
            .subscribe((cauhinh) => {
                console.log(cauhinh)
               this.selectCauhinh = cauhinh;
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
