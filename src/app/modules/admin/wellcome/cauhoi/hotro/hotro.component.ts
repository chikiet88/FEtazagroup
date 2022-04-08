import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { CauhoiService } from '../cauhoi.service';

@Component({
  selector: 'app-hotro',
  templateUrl: './hotro.component.html',
  styleUrls: ['./hotro.component.scss']
})
export class HotroComponent implements OnInit {
  @ViewChild('supportNgForm') supportNgForm: NgForm;
  hotros:any;
  supportForm: FormGroup;
  thisUser:any;
  status:boolean;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  DMchtg: any;
  Danhmucs: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
      private _formBuilder: FormBuilder,
      private _cauhoiService: CauhoiService,
      private _userService: UserService,
      private _cauhinhService: CauhinhService,
      private _changeDetectorRef: ChangeDetectorRef,
  )
  {
  }
  ngOnInit(): void
  { 
    this.status = true;

    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((user) => {
      this.thisUser = user;
      console.log(user);
      this._changeDetectorRef.markForCheck();
    });   
    this._cauhinhService.danhmucs$.subscribe((data) => {
      this.Danhmucs = data;
      this._changeDetectorRef.markForCheck();
    })  
     this._cauhoiService.hotros$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((hotros) => {
      console.log(hotros);
      this.hotros = hotros;
      this._changeDetectorRef.markForCheck();
    });
    this.supportForm = this._formBuilder.group({
          Danhmuc  : [''],
          NoidungCauhoi  : [''],
      });
      this._cauhinhService.Cauhinhs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Cauhinh[]) => {
        this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
        this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
        this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
        this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
        this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
        this.DMchtg = data.find(v => v.id == "15e3eac7-e75e-4040-87b2-ab018f20997d").detail;
        this._changeDetectorRef.markForCheck();
      });   
  }
  clearForm(): void
  {
      this.status = true;
      this.supportForm = this._formBuilder.group({
        Danhmuc  : [''],
        NoidungCauhoi  : [''],
    });

  }
  CreateHotro(): void
  {
      this.supportForm.addControl('Vitri', new FormControl([this.thisUser.profile.Vitri]));
      this.supportForm.addControl('idTao', new FormControl([this.thisUser.id]))
      const hotro = this.supportForm.getRawValue();     
      this._cauhoiService.CreateHotro(hotro).subscribe(()=>
        {
            this.clearForm();
            this.status = false;
        }
      )
  }
}
