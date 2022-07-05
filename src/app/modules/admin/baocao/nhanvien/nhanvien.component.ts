import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NotifierService } from 'angular-notifier';
import { ContactsService } from '../../apps/contacts/contacts.service';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { NhanvienService } from './nhanvien.service';
export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];
@Component({
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.scss']
})
export class NhanvienComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'name', 'Role', 'Trangthai'];
  dataSource: MatTableDataSource<UserData>;
  Menuwidth:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nhanviens:any[];
  filteredNhanviens:any[];
  Users:any
  drawerMode: 'side' | 'over';
  selectedNhanvien: any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  Chinhanh: any;
  filterdVitri: any;
  Role:any;
  Trangthai:any;
  triggerOrigin :any;
  isOpenVitri = false;
  SelectVitri: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactsService: ContactsService,
    private _nhanviensService: NhanvienService,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _notifierService: NotifierService,
    private _cauhinhService: CauhinhService,
  ) {
    this.Role = {admin:'Admin',manager:'Manager',user:'Nhân Viên',dev:'IT',new:'Mới'}
    this.Trangthai = [
        {id:0,value:'Đang Làm'},
        {id:1,value:'Nghỉ Việc'},
        {id:2,value:'Thử Việc'},

    ]
    this._cauhinhService.Cauhinhs$.subscribe((data: Cauhinh[]) => {
         this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
         this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
         this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
         this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
         this.Vitri = this.filterdVitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
         this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
        this._changeDetectorRef.markForCheck();
    });
    this._nhanviensService.nhanviens$
    .subscribe((nhanviens: any[]) => {
        this.nhanviens = this.filteredNhanviens = nhanviens;
        this.dataSource = new MatTableDataSource(nhanviens);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._changeDetectorRef.markForCheck();
        console.log(this.nhanviens);
        
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit(): void {
  }
  filterNhanvien(e)
  {

  }
  Menutoggle()
  {}
}
