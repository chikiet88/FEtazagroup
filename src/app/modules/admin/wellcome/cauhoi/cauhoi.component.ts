import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { CauhoiService } from './cauhoi.service';
import { FaqCategory } from '../../apps/help-center/help-center.type';
import { HelpCenterService } from '../../apps/help-center/help-center.service';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { UserService } from 'app/core/user/user.service';
@Component({
    selector       : 'cauhoi',
    templateUrl    : './cauhoi.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CauhoiComponent implements OnInit, OnDestroy
{
    faqCategory: FaqCategory;
    cauhois:any = [];
    Phongban: any;
    Khoi: any;
    Congty: any;
    Bophan: any;
    Vitri: any;
    thisUser: any;
    Cauhois:any = [];
    filteredCauhois:any;
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private _cauhoiService: CauhoiService,
        private _cauhinhService: CauhinhService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        )
    {
    }
    ngOnInit(): void
    {
    this._userService.user$.subscribe((data)=>{
            this.thisUser = data;
        }
    )   
      this._cauhoiService.hotros$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cauhois) => {
                this.Cauhois = cauhois;
                cauhois.forEach(v => {
                  const x =  v.Vitri.find(v1=>v1==this.thisUser.profile.Vitri);
                  console.log(x);
                  
                   if(v.Trangthai == 3 && x!=undefined)
                   {
                       this.cauhois.push(v);
                   }                    
                });   
                this.cauhois = this.cauhois.slice(0, 10);   
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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
