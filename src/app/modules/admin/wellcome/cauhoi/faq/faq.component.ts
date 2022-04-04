import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { FaqCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { CauhoiService } from '../cauhoi.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqCategories: FaqCategory[];
  cauhois:any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  thisUser: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _helpCenterService: HelpCenterService,
    private _cauhoiService: CauhoiService,
    private _cauhinhService: CauhinhService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,

    )
  {}

  ngOnInit(): void {

    this._userService.user$.subscribe((data)=>{
      this.thisUser = data;
      console.log(data);
    })
    this._cauhoiService.hotros$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((cauhois) => {
      this.cauhois = cauhois.filter(v=>v.Trangthai==3);
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
  
ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
