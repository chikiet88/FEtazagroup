import { Component, OnInit } from '@angular/core';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { FaqCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqCategories: FaqCategory[];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(private _helpCenterService: HelpCenterService)
  {}

  ngOnInit(): void {
    this._helpCenterService.faqs$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((faqCategories) => {
        this.faqCategories = faqCategories;
    });
  }
ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
