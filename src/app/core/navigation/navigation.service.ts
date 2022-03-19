import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
import { Menu } from 'app/modules/admin/cauhinh/cauhinh.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    constructor(private _httpClient: HttpClient)
    {
    }
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>(`${environment.ApiURL}/navigation`).pipe(
            tap((navigation) => {
                console.log(navigation);
                const nest = (items, id = '', link = 'parent') => items.filter(item => item[link] == id).map(item => ({
                    ...item,
                    children: nest(items, item.uuid)
                  }));
                const res = {
                compact   : nest(navigation),            
                default   : nest(navigation),
                futuristic: nest(navigation),
                horizontal: nest(navigation)
                }  
                this._navigation.next(res);
            })
        );
        // return this._httpClient.get<Navigation>('api/common/navigation').pipe(
        //     tap((navigation) => {
        //         console.log(navigation);
        //         this._navigation.next(navigation);
        //     })
        // );
    }
}
