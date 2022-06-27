import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { Subject,takeUntil } from 'rxjs';
import { ScrumboardService } from '../../apps/scrumboard/scrumboard.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CongviecService } from './congviec.service';
@Component({
  selector: 'app-congviec',
  templateUrl: './congviec.component.html',
  styleUrls: ['./congviec.component.scss']
})
export class CongviecComponent implements OnInit {
  CUser: any;
  Duans: any[];
  filteredDuans: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _scrumboardService: ScrumboardService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _congviecService: CongviecService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
  ) {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();
    });
      this._congviecService.getAllDuans().subscribe();
      this._congviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data
          console.log(this.Duans);
          this._changeDetectorRef.markForCheck();
      })
  }

  ngOnInit(): void {
  }

}
