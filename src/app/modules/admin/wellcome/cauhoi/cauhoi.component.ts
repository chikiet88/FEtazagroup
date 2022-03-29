import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { CauhoiService } from './cauhoi.service';
import { FaqCategory } from '../../apps/help-center/help-center.type';
import { HelpCenterService } from '../../apps/help-center/help-center.service';

@Component({
    selector       : 'cauhoi',
    templateUrl    : './cauhoi.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CauhoiComponent implements OnInit, OnDestroy
{
    faqCategory: FaqCategory;
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor(private _helpCenterService: HelpCenterService)
    {
    }
    ngOnInit(): void
    {
        // Get the FAQs
        this._helpCenterService.faqs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((faqCategories) => {
                this.faqCategory = faqCategories[0];
            });
    }

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
