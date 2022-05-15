import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { collectExternalReferences } from '@angular/compiler';
import Utf8 from 'crypto-js/enc-utf8';
import { HmacSHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { NotifierService } from 'angular-notifier';
import { NavigationService } from '../navigation/navigation.service';
@Injectable()
export class AuthService {
    private readonly _secret: any;
    private _authenticated: boolean = false;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private _menus: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private readonly notifier: NotifierService;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _notifierService: NotifierService,
        private _navigationService: NavigationService,


    ) {
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.notifier = _notifierService;
    }      
     get menu$(): Observable<any>
       {
           return this._menus.asObservable();
       }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }
    signIn(credentials: { username: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post(`${environment.ApiURL}/auth/login`, credentials).pipe(
            switchMap((response: any) => {
                if (response === 1) {
                    this.notifier.notify('error', `Số Điện Thoại Không Tồn Tại`);
                    return of(response);
                }
                else if (response === 2) {
                    this.notifier.notify('error', `Mật Khẩu Không Đúng`);
                    return of(response);
                }
                else {
                    this.accessToken = response.access_token;
                    this._authenticated = true;
                    this._userService.user = response.user;
                }
                return of(response);

            })
        );
    }
    changepass(data: {user:User; oldpass: string; newpass: string }): Observable<any> {
        console.log(data);
         return this._httpClient.post(`${environment.ApiURL}/auth/changepass`, data).pipe(
            tap((response: any) => {
                console.log(response);
                
                    return response;
            })
        );
    }
    signInUsingToken(): Observable<any> {
        return this._httpClient.post(`${environment.ApiURL}/auth/signbytoken`, { access_token: this.accessToken }).pipe(
            switchMap((response: any) => {
                if (response !== false) {
                    this._authenticated = true;
                    this._userService.user = response.user;
                    return of(true)
                }
                else return of(false)

            })
        );
    }
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }
    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (!this.accessToken || this.accessToken === 'undefined') {
            localStorage.removeItem('accessToken');
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        //return of(true);
        return this.signInUsingToken();
    }
    CheckMenu(): Observable<any> {
        return this._httpClient.post(`${environment.ApiURL}/auth/signbytoken`, { access_token: this.accessToken }).pipe(
            switchMap((response: any) => {
                if (response !== false) {
                    const Menus = [];
                    this._navigationService.getMenu().subscribe();
                    this._navigationService.menus$.subscribe((menus) => {
                        this._menus.next(menus);
                    });
                    this._menus.subscribe((v1)=>
                    {
                       v1.forEach(v => {
                        console.log(v);
                        Menus.push({ 'link': v.link, 'status': response.Menu[v.uuid] });
                    });}
                    )
                    return of(Menus);
                }
                else return of(false)
            })
        );
    }
}
