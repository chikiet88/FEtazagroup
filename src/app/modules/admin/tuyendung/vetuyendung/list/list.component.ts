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
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
  lists:any;
  Vitri:any;
  vetuyendungsCount: number = 0;
  drawerMode: 'over' | 'side';
  searchInputControl: FormControl = new FormControl();


  private readonly _positionStep: number = 65536;
  private readonly _maxListCount: number = 200;
  private readonly _maxPosition: number = this._positionStep * 500;
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
        this.lists = [
            {id : '1',position: 65536,title:'Bước 1',mota:'Tạo Phiếu Tuyển Dụng',vetd:[{"id":"5d60e592-94fa-4ea2-8838-34b91e5f5f49","idVitri":"","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-21T02:00:10.177Z","idTao":0},{"id":"035e6e03-8bc1-4071-aa28-0d8ff7c96fe3","idVitri":"4aebb23f-0009-4765-8616-2ec0bc3bf721","SLHT":3,"SLCT":5,"LuongDK":2000000,"TGThuviec":1,"TNNS":{},"Lydo":1,"Mota":"6558","Yeucau":"<p style=\"text-align: center;\">Jsgsfnnshshsb</p>\n<p style=\"text-align: center;\">Đhshbushhshdbdbdbhhshsbsbjd</p>\n<p style=\"text-align: center;\"> </p>\n<p style=\"text-align: center;\">Dnbdbsn</p>\n<p style=\"text-align: center;\"> </p>\n<p style=\"text-align: center;\">Dnbdbsn</p>\n<p style=\"text-align: center;\">Bsgagahabc</p>\n<p style=\"text-align: center;\"> </p>","Pheduyet":"4aebb23f-0009-4765-8616-2ec0bc3bf721","Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T21:18:03.254Z","idTao":0},{"id":"b672557f-071d-43bf-8bbc-f3a5335f330a","idVitri":"d9dfcd17-3bdb-4ef7-9675-336e33d0592b","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T21:15:04.600Z","idTao":0},{"id":"84e6dce0-82ae-484d-a892-74a028f86915","idVitri":"4aebb23f-0009-4765-8616-2ec0bc3bf721","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T20:49:34.108Z","idTao":0},{"id":"18c17c2b-0e21-4551-ac80-c4bd370223dc","idVitri":"30941412-66c5-4676-8862-7de27aa86c85","SLHT":3,"SLCT":5,"LuongDK":1000000,"TGThuviec":2,"TNNS":{},"Lydo":1,"Mota":"1","Yeucau":"<p>Yêu Cầu : Thông Thạo Ngôn Ngữ Lập Trình</p>","Pheduyet":"d9dfcd17-3bdb-4ef7-9675-336e33d0592b","Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T20:39:56.109Z","idTao":0},{"id":"d4d239e1-1cbd-4034-9592-41fad170f830","idVitri":"30941412-66c5-4676-8862-7de27aa86c85","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T19:54:06.928Z","idTao":0},{"id":"70ff8150-d93f-4d99-8275-1a7bb1102138","idVitri":"eceb6560-47b2-480f-b876-857e48f7d723","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T19:53:23.348Z","idTao":0}]},
            {id : '2',position: 65536,title:'Bước 2',mota:'Duyệt phiếu tuyển dụng',vetd:[]},
            {id : '3',position: 65536,title:'Bước 3',mota:'Tiếp nhận tuyển dụng',vetd:[]},
            {id : '4',position: 65536,title:'Bước 4',mota:'Phê duyệt phiếu',vetd:[{"id":"5d60e592-94fa-4ea2-8838-34b91e5f5f49","idVitri":"","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-21T02:00:10.177Z","idTao":0},{"id":"035e6e03-8bc1-4071-aa28-0d8ff7c96fe3","idVitri":"4aebb23f-0009-4765-8616-2ec0bc3bf721","SLHT":3,"SLCT":5,"LuongDK":2000000,"TGThuviec":1,"TNNS":{},"Lydo":1,"Mota":"6558","Yeucau":"<p style=\"text-align: center;\">Jsgsfnnshshsb</p>\n<p style=\"text-align: center;\">Đhshbushhshdbdbdbhhshsbsbjd</p>\n<p style=\"text-align: center;\"> </p>\n<p style=\"text-align: center;\">Dnbdbsn</p>\n<p style=\"text-align: center;\"> </p>\n<p style=\"text-align: center;\">Dnbdbsn</p>\n<p style=\"text-align: center;\">Bsgagahabc</p>\n<p style=\"text-align: center;\"> </p>","Pheduyet":"4aebb23f-0009-4765-8616-2ec0bc3bf721","Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T21:18:03.254Z","idTao":0},{"id":"b672557f-071d-43bf-8bbc-f3a5335f330a","idVitri":"d9dfcd17-3bdb-4ef7-9675-336e33d0592b","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T21:15:04.600Z","idTao":0},{"id":"84e6dce0-82ae-484d-a892-74a028f86915","idVitri":"4aebb23f-0009-4765-8616-2ec0bc3bf721","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T20:49:34.108Z","idTao":0},{"id":"18c17c2b-0e21-4551-ac80-c4bd370223dc","idVitri":"30941412-66c5-4676-8862-7de27aa86c85","SLHT":3,"SLCT":5,"LuongDK":1000000,"TGThuviec":2,"TNNS":{},"Lydo":1,"Mota":"1","Yeucau":"<p>Yêu Cầu : Thông Thạo Ngôn Ngữ Lập Trình</p>","Pheduyet":"d9dfcd17-3bdb-4ef7-9675-336e33d0592b","Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T20:39:56.109Z","idTao":0},{"id":"d4d239e1-1cbd-4034-9592-41fad170f830","idVitri":"30941412-66c5-4676-8862-7de27aa86c85","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T19:54:06.928Z","idTao":0},{"id":"70ff8150-d93f-4d99-8275-1a7bb1102138","idVitri":"eceb6560-47b2-480f-b876-857e48f7d723","SLHT":0,"SLCT":0,"LuongDK":0,"TGThuviec":0,"TNNS":{},"Lydo":0,"Mota":"","Yeucau":"","Pheduyet":{},"Trangthai":0,"published":0,"ordering":0,"Ngaytao":"2022-02-20T19:53:23.348Z","idTao":0}]},
            {id : '5',position: 65536,title:'Bước 5',mota:'Triển khai tuyển dụng',vetd:[]},
            {id : '6',position: 65536,title:'Bước 6',mota:'Phê duyệt tuyển dụng',vetd:[]},
            {id : '7',position: 65536,title:'Bước 7',mota:'Xác nhận thanh toán',vetd:[]},
            {id : '8',position: 65536,title:'Bước 8',mota:'Thực hiện tuyển dụng',vetd:[]},
        ]
        console.log(this.lists);
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

            // this.matDrawer.openedChange.subscribe((opened) => {
            //     if ( !opened )
            //     {
            //         this.selectedVetuyendung = null;
            //         this._changeDetectorRef.markForCheck();
            //     }
            // });            
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
    
    listDropped(event: any): void
    {
        
    } 

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
