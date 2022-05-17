import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
import { Menu } from 'app/modules/admin/cauhinh/cauhinh.types';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    user: User;
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _menus: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    ) {
    }
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }
    get menus$(): Observable<any> {
        return this._menus.asObservable();
    }
    get(): Observable<Navigation> {
        return this._httpClient.get<any>(`${environment.ApiURL}/navigation`).pipe(
            tap((navigation) => {
                console.log(navigation);
                
                const nav = [];
                this._userService.get().subscribe((data) => {
                    navigation.forEach(v => {
                        if (data.Menu[v.uuid]) {
                            nav.push(v);
                        }
                    });
                    const nest = (items, id = '', link = 'parent') => items.filter(item => item[link] == id).map(item => ({
                        ...item,
                        children: nest(items, item.uuid)
                    }));
                    const res = {
                        compact: nest(nav),
                        default: nest(nav),
                        futuristic: nest(nav),
                        horizontal: nest(nav)
                    }
                    this._navigation.next(res);
                }
                )
            })
        );
        
        // return this._httpClient.get<Navigation>('api/common/navigation').pipe(
        //     tap((navigation) => {
        //         console.log(navigation);
        //         this._navigation.next(navigation);
        //     })
        // );
    }

    getMenu(): Observable<any> {
        return this._httpClient.get<any>(`${environment.ApiURL}/navigation`).pipe(
            tap((res) => {   
                return this._menus.next(res); 
            })
        )
    }
}
