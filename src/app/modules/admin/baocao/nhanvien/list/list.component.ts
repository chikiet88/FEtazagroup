import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, fromEvent, map, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Contact, Country } from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Nhanvien } from '../nhanvien.type';
import { NhanvienService } from '../nhanvien.service';
import { NotifierService } from 'angular-notifier';
import { User } from '../users';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
//  const vitri = require('app/v1json/vitri.json');
//  const bophan = require('app/v1json/bophan.json');
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy
{
    displayedColumns: string[] = ['avatar', 'name','Vitri', 'Role','Trangthai'];
    dataSource: MatTableDataSource<Nhanvien>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;    
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    searchText:string;
    contacts$: Observable<Contact[]>;
    nhanviens$: Observable<Nhanvien[]>;
    nhanviens:Nhanvien[];
    filteredNhanviens:Nhanvien[];
    nhanviensCount: number = 0;
    Users:any
    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    selectedContact: Contact;
    selectedNhanvien: Nhanvien;
    Phongban: object;
    Khoi: object;
    Congty: object;
    Bophan: object;
    Vitri: object;
    Chinhanh: object;
    Role:any;
    Trangthai:any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _nhanviensService: NhanvienService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _notifierService: NotifierService,
        private _cauhinhService: CauhinhService,
    )
    {
        this._nhanviensService.getNhanviens().subscribe();
    }
    ngOnInit(): void
    {
        this.Role = {admin:'Admin',manager:'Manager',user:'Nhân Viên',dev:'IT',new:'Mới'}
        this.Trangthai = [
            {id:0,value:'Đang Làm'},
            {id:1,value:'Nghỉ Việc'}
        ]
        this._cauhinhService.Cauhinhs$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Cauhinh[]) => {
             this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
             this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
             this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
             this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
             this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
             this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
            this._changeDetectorRef.markForCheck();
        });
        this._nhanviensService.nhanviens$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((nhanviens: Nhanvien[]) => {
            console.log(nhanviens);
            nhanviens != null?this.nhanviensCount = nhanviens.length:this.nhanviensCount=0;
            //console.log(vitri);
            // nhanviens.forEach(v => {
            //    let x = vitri.find((v1)=> Number(v1.OLDID)  == Number(v.profile.Vitri1));
            //    let y = bophan.find((v2)=> Number(v2.OLDID)  == Number(v.profile.Bophan1));
            //    if(x!=undefined){v.profile.Vitri = x.NEWID;}
            //    if(y!=undefined){v.profile.Bophan = y.NEWID;}
            // });
            this.nhanviens = this.filteredNhanviens = nhanviens;
            this.dataSource = new MatTableDataSource(nhanviens);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
         //   console.log(nhanviens);
            // nhanviens.forEach((v,k)=> {
            //     console.log(v,k);
            //     setTimeout(() => {
            //         this._nhanviensService.updateNhanvien(v.id,v).subscribe();
            //     }, k*100);
            // });
            this._changeDetectorRef.markForCheck();
        });
        // this._nhanviensService.nhanvien$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((nhanvien: Nhanvien) => {
        //         this.selectedNhanvien = nhanvien;
        //         this._changeDetectorRef.markForCheck();
        //     });
        // this.matDrawer.openedChange.subscribe((opened) => {
        //     if ( !opened )
        //     {
        //         this.selectedNhanvien = null;
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
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createNhanvien();
            });
    }
    filterByQuery(event:Event): void
    {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        // if ( !query )
        // {
        //     this.filteredNhanviens = this.nhanviens;
        //     return;
        // }
        // this.filteredNhanviens = this.nhanviens.filter(v => v.name.toLowerCase().includes(query.toLowerCase())); 

    }
    ChangeRole(item,e): void
    {
        item.Role = e.value;
        this._nhanviensService.updateNhanvien(item.id,item).subscribe();
    }
    ChangeUser(item,prop,e): void
    {
        item[prop] = e.value;
        this._nhanviensService.updateNhanvien(item.id,item).subscribe();
    }
    ChangeState(item,prop,value): void
    {
        item[prop] = value;
        this._nhanviensService.updateNhanvien(item.id,item).subscribe();
    }
    ChangeProfile(item,pro,value): void
    {
        item.profile[pro] = value;
        this._nhanviensService.updateNhanvien(item.id,item).subscribe();
    }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }
    ImportNhanvien(): void
    {
        this.Users.forEach(v => {
            const user ={name:v.name,SDT:v.username,email:v.email,profile:v.Profile,password:"12345678"};
                this._nhanviensService.ImportNhanvien(user).subscribe((data) => {
                        console.log(data);
                        this._changeDetectorRef.markForCheck();
                    });
        });
    }
    createNhanvien(): void
    {
    if(this.nhanviens.length==0)
        {
            this._nhanviensService.createNhanvien().subscribe((newNhanvien) => {
                this._router.navigate(['./', newNhanvien.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            });
    }
    else
    {
    const name = this.nhanviens[0].name;
    if(name=="Mới")
    {
             this._notifierService.notify('error', 'Có Nhân Sự Mới Chưa Điền');
             const filterValue = "Mới";
             this.dataSource.filter = filterValue.trim().toLowerCase();
             //this.filterByQuery("Mới");
     }
     else {

            this._nhanviensService.createNhanvien().subscribe((newNhanvien) => {
                this._router.navigate(['./', newNhanvien.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            }); 
         }
     }
    }
    UpdateRole(role): void
    {
         this._nhanviensService.createNhanvien().subscribe(() => {});
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
