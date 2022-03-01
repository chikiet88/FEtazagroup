// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-list',
//   templateUrl: './list.component.html',
//   styleUrls: ['./list.component.scss']
// })
// export class ListComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, fromEvent, map, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Contact, Country } from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import { FormControl } from '@angular/forms';
import { Nhanvien } from '../nhanvien.type';
import { NhanvienService } from '../nhanvien.service';
import { NotifierService } from 'angular-notifier';
import { User } from '../users';
// @Component({
//     selector       : 'contacts-list',
//     templateUrl    : './list.component.html',
//     encapsulation  : ViewEncapsulation.None,
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    searchText:string;
    contacts$: Observable<Contact[]>;
    nhanviens$: Observable<Nhanvien[]>;
    nhaviens:Nhanvien[];
    nhanviensCount: number = 0;
    Users:any
    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    selectedContact: Contact;
    selectedNhanvien: Nhanvien;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _nhanviensService: NhanvienService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _notifierService: NotifierService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
       // this.nhanviens$ = this._nhanviensService.nhanviens$;

        this.nhanviens$ = combineLatest([this._nhanviensService.nhanviens$, this.searchQuery$]).pipe(
            distinctUntilChanged(),
            map(([nhanviens, searchQuery]) => {
                if ( !nhanviens || !nhanviens.length )
                {
                    return;
                }
                let filteredNotes = nhanviens;
                if ( searchQuery )
                {
                    searchQuery = searchQuery.trim().toLowerCase();
                    filteredNotes = filteredNotes.filter(nhanvien => nhanvien.name.toLowerCase().includes(searchQuery) || nhanvien.SDT.toLowerCase().includes(searchQuery)|| nhanvien.email.toLowerCase().includes(searchQuery));
                }
                return filteredNotes;
            })
        );

        
        this._nhanviensService.nhanviens$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((nhanviens: Nhanvien[]) => {
            this.nhanviensCount = nhanviens.length;
            this.nhaviens = nhanviens;
            this._changeDetectorRef.markForCheck();
        });
        this._nhanviensService.nhanvien$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((nhanvien: Nhanvien) => {
                this.selectedNhanvien = nhanvien;
                this._changeDetectorRef.markForCheck();
            });
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                this.selectedNhanvien = null;
                this._changeDetectorRef.markForCheck();
            }
        });
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }
                this._changeDetectorRef.markForCheck();
            });
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createNhanvien();
            });
    }
    filterByQuery(query: string): void
    {
        this.searchQuery$.next(query);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    ImportNhanvien(): void
    {
        this.Users.forEach(v => {
            const user ={name:v.name,SDT:v.username,email:v.email,profile:v.Profile,password:"12345678"};
                this._nhanviensService.ImportNhanvien(user).subscribe((data) => {
                        console.log(data);
                        this._changeDetectorRef.markForCheck();
                    });
        });
 
    }


    createNhanvien(): void
    {
    if(this.nhaviens.length==0)
        {
            this._nhanviensService.createNhanvien().subscribe((newNhanvien) => {
                this._router.navigate(['./', newNhanvien.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            });
     }
     else
     {
         const name = this.nhaviens[0].name;
      if(name=="Mới")
         {
             this._notifierService.notify('error', 'Có Nhân Sự Mới Chưa Điền');
             this.filterByQuery("Mới");
             
         }
         else {
            this._nhanviensService.createNhanvien().subscribe((newNhanvien) => {
                this._router.navigate(['./', newNhanvien.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            }); 
         }
     }



    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
