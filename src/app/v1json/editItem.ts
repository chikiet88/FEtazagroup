@ViewChild('PanelOrigin') private _PanelOrigin: ElementRef;
@ViewChild('Panel') private _Panel: TemplateRef<any>;
filteredItems: any[];
Cauhoituongtu: any[];


    private _renderer2: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef


openPanel(): void {
    this._PanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._PanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });
    this._PanelOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._PanelOrigin.nativeElement, 'panel-opened');
      this._PanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._Panel, this._viewContainerRef);
    this._PanelOverlayRef.attach(templatePortal);
    this._PanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._PanelOrigin.nativeElement, 'panel-opened');
      if (this._PanelOverlayRef && this._PanelOverlayRef.hasAttached()) {
        this._PanelOverlayRef.detach();
        //this.filteredItems = this.Status;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  filterPanel(event): void {
    const value = event.target.value.toLowerCase();
    this.filteredItems = this.Status.filter(v => v.title.toLowerCase().includes(value));
  }
  addItem(data,item): void {
    data.Cauhoituongtu.push(item.id);
    this._cauhoiService.UpdateTraloi(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  removeItem(data,item): void {
    data.Cauhoituongtu = data.Cauhoituongtu.filter(v=>v!=item.id);
    this._cauhoiService.UpdateTraloi(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  toggleItem(data,item): void {      
    if (data.Cauhoituongtu.includes(item.id))
    {
     
        this.removeItem(data,item);
    }
    else
    {
        this.addItem(data,item);
    }
  }



  <div class="flex flex-wrap items-center">
  <ng-container *ngIf="row.Cauhoituongtu.length!=0">
      <ng-container *ngFor="let item of row.Cauhoituongtu">
          <div class="flex items-center justify-center px-4 m-1.5 rounded-full leading-9 text-white bg-blue-500 dark:text-gray-300 dark:bg-gray-700">
              <span class="text-md font-medium whitespace-nowrap">{{item|findbyid:filteredItems:'Tieude'}}</span>
          </div>
      </ng-container>
  </ng-container>
  <div
      class="flex items-center justify-center px-4 m-1.5 rounded-full leading-9 cursor-pointer text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-700"
      (click)="openPanel()"
      #PanelOrigin>

      <ng-container *ngIf="row.Cauhoituongtu.length!=0">
          <mat-icon
              class="icon-size-5"
              [svgIcon]="'heroicons_solid:pencil-alt'"></mat-icon>
          <span class="ml-1.5 text-md font-medium whitespace-nowrap">Sửa</span>
      </ng-container>
      <ng-container *ngIf="row.Cauhoituongtu.length==0">
          <mat-icon
              class="icon-size-5"
              [svgIcon]="'heroicons_solid:plus-circle'"></mat-icon>
          <span class="ml-1.5 text-md font-medium whitespace-nowrap">Thêm</span>
      </ng-container>

      <ng-template #Panel>
          <div class="w-60 rounded border shadow-md bg-card">
              <div class="flex items-center m-3 mr-2">
                  <div class="flex items-center">
                      <mat-icon
                          class="icon-size-5"
                          [svgIcon]="'heroicons_solid:search'"></mat-icon>
                      <div class="ml-2">
                          <input
                              class="w-full min-w-0 py-1 border-0"
                              type="text"
                              placeholder="Tìm Kiếm"
                              (input)="filterPanel($event)"
                              [maxLength]="30"
                              #newPanelInput>
                      </div>
                  </div>
              </div>
              <div
                  class="flex flex-col max-h-64 py-2 border-t overflow-y-auto">
                  <ng-container *ngIf="!editItems">
                      <ng-container *ngFor="let item of filteredItems">
                          <div
                              class="flex items-center h-10 min-h-10 px-4 cursor-pointer hover:bg-hover"
                              (click)="toggleItem(row,item)"
                              matRipple>
                              <mat-checkbox
                                  class="flex items-center h-10 min-h-10 pointer-events-none"
                                  [checked]="row.Cauhoituongtu.includes(item.id)"
                                  [color]="'primary'"
                                  [disableRipple]="true">
                              </mat-checkbox>
                              <div class="ml-1">{{item.Tieude}}</div>
                          </div>
                      </ng-container>
                  </ng-container>
                  <ng-container *ngIf="editItems">
                      <div class="py-2 space-y-2">
                          <ng-container *ngFor="let item of filteredItems; trackBy: trackByFn">
                              <div class="flex items-center">
                                  <mat-form-field class="fuse-mat-dense fuse-mat-no-subscript w-full mx-4">
                                      <input
                                          matInput
                                          [value]="item.Tieude"
                                          (input)="updateTagTitle(item, $event)">
                                      <button
                                          mat-icon-button
                                          (click)="deleteTag(item)"
                                          matSuffix>
                                          <mat-icon
                                              class="icon-size-5 ml-2"
                                              [svgIcon]="'heroicons_solid:trash'"></mat-icon>
                                      </button>
                                  </mat-form-field>
                              </div>
                          </ng-container>
                      </div>
                  </ng-container>  
              </div>
          </div>
      </ng-template>
  </div>
</div>