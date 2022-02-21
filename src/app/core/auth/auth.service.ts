import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { collectExternalReferences } from '@angular/compiler';
import Utf8 from 'crypto-js/enc-utf8';
import { HmacSHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { NotifierService } from 'angular-notifier';
@Injectable()
export class AuthService
{
    private readonly _secret: any;
    private _authenticated: boolean = false;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private readonly notifier: NotifierService;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _notifierService: NotifierService,
  
    )
    {
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.notifier = _notifierService;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string; password: string }): Observable<any>
    {
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(`${environment.ApiURL}/auth/login`, credentials).pipe(
            switchMap((response: any) => {
                if(response===1)
                {
                    this.notifier.notify('error', `Số Điện Thoại Không Tồn Tại`);
                    return of(response);
                }
                else if(response===2)
                {
                    this.notifier.notify('error', `Mật Khẩu Không Đúng`);
                    return of(response);
                }
                else 
                {
                this.accessToken = response.access_token;
                this._authenticated = true;
                this._userService.user = response.user;
                }
                return of(response);
               
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.result.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.result.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        if ( this._authenticated )
        {
            return of(true);
        }
        if ( !this.accessToken || this.accessToken === 'undefined' )
        {
            localStorage.removeItem('accessToken');
            return of(false);
        }
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }
        return of(true);
        //this.signInUsingToken();
    }
}
