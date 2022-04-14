import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { FaqCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CauhoiService } from '../cauhoi.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqCategories: FaqCategory[];
  Cauhois:any = [];
  filteredCauhois:any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  thisUser: any;
  Danhmucs: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  filter$: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(
    private _cauhoiService: CauhoiService,
    private _cauhinhService: CauhinhService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,

    )
  {}
  get filterStatus(): string
  {
      return this.filter$.value;
  }
  ngOnInit(): void {

    this._userService.user$.subscribe((data)=>{
      this.thisUser = data;
      console.log(data);
    })
    this._cauhinhService.danhmucs$.subscribe((data) => {
      this.Danhmucs = data;
      console.log(this.Danhmucs);
      this._changeDetectorRef.markForCheck();
    })
    this._cauhoiService.hotros$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((cauhois) => {
      cauhois.forEach(v => {
        const x =  v.Vitri.find(v1=>v1==this.thisUser.profile.Vitri);
         if(v.Trangthai == 3 && x!=undefined)
         {
             this.Cauhois.push(v);
         }                   
      });
      this.filteredCauhois = this.Cauhois;
    });
    this._cauhinhService.Cauhinhs$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: Cauhinh[]) => {
      this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
      this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
      this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
      this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
      this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
      this._changeDetectorRef.markForCheck();         
    }); 
  }
filterByQuery(query: string): void
  {
      if ( !query )
      {
          this.filteredCauhois = this.Cauhois;
          return;
      }
      this.filteredCauhois = this.Cauhois.filter(v => v.NoidungCauhoi.toLowerCase().includes(query.toLowerCase())
      || v.NoidungTraloi.toLowerCase().includes(query.toLowerCase()));
  }
FilterDanhmuc(item): void
  {
    this.filter$.next(item.id);
    this.filteredCauhois = this.Cauhois.filter(v=>v.Danhmuc == item.id);
  }
ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
