import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hoso',
  templateUrl: './hoso.component.html',
  styleUrls: ['./hoso.component.scss']
})
export class HosoComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'account';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(       
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService
    ) { }
  ngOnInit(): void {
            
            this.panels = [
            //   {
            //       id         : 'account',
            //       icon       : 'heroicons_outline:user-circle',
            //       title      : 'Tài Khoản',
            //       description: 'Thông tin cá nhân'
            //   },
              {
                  id         : 'security',
                  icon       : 'heroicons_outline:lock-closed',
                  title      : 'Bảo Mật',
                  description: 'Bảo mật tài khoản'
              },
            //   {
            //       id         : 'plan-billing',
            //       icon       : 'heroicons_outline:credit-card',
            //       title      : 'Thanh toán',
            //       description: 'Quản lý thông tin thanh toán'
            //   },
            //   {
            //       id         : 'notifications',
            //       icon       : 'heroicons_outline:bell',
            //       title      : 'Thông Báo',
            //       description: 'Quản Lý Thông Báo'
            //   },
            //   {
            //       id         : 'team',
            //       icon       : 'heroicons_outline:user-group',
            //       title      : 'Đội Nhóm',
            //       description: 'Quản Lý Đội Nhóm'
            //   }
          ];
  
          
          this._fuseMediaWatcherService.onMediaChange$
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(({matchingAliases}) => {
  
                  
                  if ( matchingAliases.includes('lg') )
                  {
                      this.drawerMode = 'side';
                      this.drawerOpened = true;
                  }
                  else
                  {
                      this.drawerMode = 'over';
                      this.drawerOpened = false;
                  }
  
                  
                  this._changeDetectorRef.markForCheck();
              });
  }

       ngOnDestroy(): void
       {
           
           this._unsubscribeAll.next(null);
           this._unsubscribeAll.complete();
       }
       goToPanel(panel: string): void
       {
           this.selectedPanel = panel;          
           if ( this.drawerMode === 'over' )
           {
               this.drawer.close();
           }
       }
       getPanelInfo(id: string): any
       {
           return this.panels.find(panel => panel.id === id);
       }
       trackByFn(index: number, item: any): any
       {
           return item.id || index;
       }

}
