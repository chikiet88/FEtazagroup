import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MockProducts, Product } from './model';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-wheel',
    templateUrl: './wheel.component.html',
    styleUrls: ['./wheel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WheelComponent implements OnInit {
    private readonly notifier: NotifierService;
    userList = JSON.parse(localStorage.getItem('userList')) || [];
    userDadangky
    user;
    isPopup = false;
    userListTrungthuong =
        JSON.parse(localStorage.getItem('userListTrungthuong')) || [];
    isDangky = false;
    isSpin = false;
    isDadangky = false
    @ViewChild(NgxWheelComponent, { static: false }) wheel;
    phoneRegex =
        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    signInForm: FormGroup;
    seed = MockProducts;
    idToLandOn: any;
    items: any[];
    textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
    textAlignment: TextAlignment = TextAlignment.OUTER;
    constructor(
        private _formBuilder: FormBuilder,
        notifierService: NotifierService // private _notifierService: NotifierService
    ) {
        this.notifier = notifierService;
    }
    ngOnInit() {
        this.signInForm = this._formBuilder.group({
            SDT: [
                '',
                [Validators.required, Validators.pattern(this.phoneRegex)],
            ],
            Hoten: ['', Validators.required],
        });
        this.idToLandOn =
            this.seed[Math.floor(Math.random() * this.seed.length)];
        console.log(this.idToLandOn);

        const colors = ['#00256E', '#000000'];
        this.items = this.seed.map((value) => ({
            fillStyle: colors[value.id % 2],
            text: `Giải thưởng ${value.id}`,
            id: value,
            textFillStyle: 'white',
            textFontSize: '20',
        }));
    }
    reset() {
        this.wheel.reset();
    }
    before() {
        // alert('Your wheel is about to spin');
    }
    dangky() {
        if (this.signInForm.get('SDT').hasError('required')) {
            this.notifier.notify('error', `Vui lòng nhập số điện thoại`);
        }
        if (this.signInForm.get('SDT').hasError('pattern')) {
            this.notifier.notify('error', `Số điện thoại không đúng định dạng`);
        }
        if (this.signInForm.get('Hoten').hasError('required')) {
            this.notifier.notify('error', `Vui lòng nhập Họ và tên`);
        } else {
            if (this.signInForm.invalid) {
                return;
            }
            let index = this.userList.findIndex(
                (e) => e.SDT == this.signInForm.get('SDT').value
            );
            if (index === -1) {
                this.isSpin = true;
                this.isDangky = false;
                this.user = this.signInForm.value;
                this.userList.push(this.signInForm.value);
                localStorage.setItem('userList', JSON.stringify(this.userList));
                this.notifier.notify('success', `Bạn đã đăng ký thành công`);
            } else {
                this.notifier.notify('error', `Bạn đã đăng ký tham gia`);
                this.isSpin = false;
                this.isDadangky = true
              this.userDadangky =   this.userListTrungthuong[index]
            }
        }
    }
    async spin() {
        // this.idToLandOn = prize;
        if (this.isSpin == true) {
            await new Promise((resolve) => setTimeout(resolve, 0));
            this.wheel.spin();
        } else {
            this.notifier.notify(
                'error',
                `Bạn đăng ký tham gia để xoay vòng xoay may mắn`
            );
        }
    }

    after() {
        if (this.isSpin == true) {
            var today = new Date().toLocaleDateString();
            var time= new Date().toLocaleTimeString();
            let date  =  time+' '+today
            this.signInForm.addControl(
                'Giaithuong',
                new FormControl(this.idToLandOn.name)
            );
            this.signInForm.addControl('Date', new FormControl(date));

            this.signInForm.get('Giaithuong').setValue(this.idToLandOn.name);
            this.userListTrungthuong.push(this.signInForm.value);
            localStorage.setItem(
                'userListTrungthuong',
                JSON.stringify(this.userListTrungthuong)
            );
            this.isPopup = true;
        }
    }
}
