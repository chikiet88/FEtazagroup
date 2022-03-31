import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
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
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
      private _formBuilder: FormBuilder,
      private _cauhoiService: CauhoiService,
      private _userService: UserService,
      private _changeDetectorRef: ChangeDetectorRef,
  )
  {
  }
  ngOnInit(): void
  { 
    this.status = true;
    this._userService.user$.subscribe((data)=>
        {
            this.thisUser = data;
            console.log(data);
            
        }
    )
     this._cauhoiService.hotros$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((hotros) => {
      console.log(hotros);
      this.hotros = hotros;
      this._changeDetectorRef.markForCheck();
    });
    this.supportForm = this._formBuilder.group({
          Tieude   : [''],
          NoidungCauhoi  : [''],
      });
  }
  clearForm(): void
  {
      this.status = true;
      this.supportForm = this._formBuilder.group({
        Tieude   : [''],
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
