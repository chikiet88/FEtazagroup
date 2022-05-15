import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector       : 'hoso-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HosoSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _userService: UserService,
        private _notifierService: NotifierService,
    )
    {}
    CUser:User;
    ngOnInit(): void
    {
        this._userService.user$.subscribe((data)=>
        {
            this.CUser = data
        })
        this.securityForm = this._formBuilder.group({
            oldpass  : ['', Validators.required ],
            newpass      : ['',Validators.required],
        });
        
    }
    ChangePassword()
    {
        const password = this.securityForm.getRawValue();
        const data =  Object.assign({user:this.CUser}, password);
        this._authService.changepass(data).subscribe((res)=>
        {
            if(res==1)
            {
                this._notifierService.notify('error','Sai Mật Khẩu Hiện Tại')
            }
            else {
                this.securityForm.reset();
                this._notifierService.notify('success','Cập Nhật Mật Khẩu Thành Công')
            }
        }  
        );
    }
}
