import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SharedService } from 'app/shared/shared.service';
import { forkJoin, Observable } from 'rxjs';
import { HelpCenterService } from '../../apps/help-center/help-center.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { CauhoithuonggapService } from './cauhoithuonggap.service'; 

@Injectable({
    providedIn: 'root'
})
export class CauhoithuonggapResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _cauhoiService: CauhoithuonggapService,
        private _cauhinhService: CauhinhService,
        private _nhanvienService: NhanvienService,
        private _sharedService: SharedService,
        )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
       
        return forkJoin([
            this._cauhoiService.getAllHotro(),
            this._cauhinhService.getCauhinhs(),
            this._cauhinhService.getAllDanhmuc(),
            this._nhanvienService.getNhanviens(),
            this._sharedService.getAllUpload(),
        ]);
    }
}
@Injectable({
    providedIn: 'root'
})
export class HuongdanResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _cauhoiService: CauhoithuonggapService,
        private _cauhinhService: CauhinhService,
        private _nhanvienService: NhanvienService,
        )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
       
        return forkJoin([
            this._cauhoiService.getAllHotro(),
            this._cauhinhService.getCauhinhs(),
            this._cauhinhService.getAllDanhmuc(),
            this._nhanvienService.getNhanviens(),
        ]);
    }
}
