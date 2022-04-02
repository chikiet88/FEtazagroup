

  @ViewChild('PanelOrigin') private _PanelOrigin: ElementRef;
  @ViewChild('Panel') private _Panel: TemplateRef<any>;
  tagsEditMode: boolean = false;
  filteredTags: any[];



    private _PanelOverlayRef: OverlayRef;
    private _renderer2: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  
    
this.Status = [
    {id:0,title:'Chưa Xem'},
    {id:1,title:'Trùng Lặp'},
    {id:2,title:'Không Phù Hợp'},
    {id:3,title:'Xuất Bản'},
  ]
this.filteredTags = this.Status;


openPanel(): void
{
    this._PanelOverlayRef = this._overlay.create({
        backdropClass   : '',
        hasBackdrop     : true,
        scrollStrategy  : this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
                              .flexibleConnectedTo(this._PanelOrigin.nativeElement)
                              .withFlexibleDimensions(true)
                              .withViewportMargin(64)
                              .withLockedPosition(true)
                              .withPositions([
                                  {
                                      originX : 'start',
                                      originY : 'bottom',
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
    if ( this._PanelOverlayRef && this._PanelOverlayRef.hasAttached() )
        {
            this._PanelOverlayRef.detach();
           this.filteredTags = this.Status;
            this.tagsEditMode = false;
        }
        if ( templatePortal && templatePortal.isAttached )
        {
            templatePortal.detach();
        }
    });
}
filterPanel(event): void
{
    const value = event.target.value.toLowerCase();
    this.filteredTags = this.Status.filter(v => v.title.toLowerCase().includes(value));
}
filterTagsInputKeyDown(event): void
{
    if ( event.key !== 'Enter' )
    {
        return;
    }
    if ( this.filteredTags.length === 0 )
    {
        this.createTag(event.target.value);
        event.target.value = '';
        return;
    }
    const tag = this.filteredTags[0];
    const isTagApplied = this.Status.find(id => id === tag.id);
    if ( isTagApplied )
    {
        this.removeTagFromContact(tag);
    }
    else
    {
        this.addTagToContact(tag);
    }
}
addTagToContact(tag): void
{
    // // Add the tag
    // this.contact.tags.unshift(tag.id);

    // // Update the contact form
    // this.contactForm.get('tags').patchValue(this.contact.tags);

    // // Mark for check
    // this._changeDetectorRef.markForCheck();
}
removeTagFromContact(tag): void
{
    // // Remove the tag
    // this.contact.tags.splice(this.contact.tags.findIndex(item => item === tag.id), 1);

    // // Update the contact form
    // this.contactForm.get('tags').patchValue(this.contact.tags);

    // // Mark for check
    // this._changeDetectorRef.markForCheck();
}
toggleTagsEditMode(): void
{
    this.tagsEditMode = !this.tagsEditMode;
}
toggleContactTag(tag): void
{
    // if ( this.contact.tags.includes(tag.id) )
    // {
    //     this.removeTagFromContact(tag);
    // }
    // else
    // {
    //     this.addTagToContact(tag);
    // }
}
updateTagTitle(tag, event): void
{
    // // Update the title on the tag
    // tag.title = event.target.value;

    // // Update the tag on the server
    // this._contactsService.updateTag(tag.id, tag)
    //     .pipe(debounceTime(300))
    //     .subscribe();

    // this._changeDetectorRef.markForCheck();
}
createTag(title): void
{
    const tag = {
        title
    };

    // Create tag on the server
    // this._contactsService.createTag(tag)
    //     .subscribe((response) => {

    //         // Add the tag to the contact
    //         this.addTagToContact(response);
    //     });
}
deleteTag(tag): void
{
    // this._contactsService.deleteTag(tag.id).subscribe();
    this._changeDetectorRef.markForCheck();
}
shouldShowCreateTagButton(inputValue): boolean
{
  return true;
    //return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
}



<div class="flex flex-wrap items-center -m-1.5 mt-6">
<ng-container *ngIf="Status.length">
    <ng-container *ngFor="let item of Status">
        <div class="flex items-center justify-center px-4 m-1.5 rounded-full leading-9 text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-700">
            <span class="text-md font-medium whitespace-nowrap">{{item.title}}</span>
        </div>
    </ng-container>
</ng-container>
<div
    class="flex items-center justify-center px-4 m-1.5 rounded-full leading-9 cursor-pointer text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-700"
    (click)="openPanel()"
    #PanelOrigin>

    <ng-container *ngIf="Status.length">
        <mat-icon
            class="icon-size-5"
            [svgIcon]="'heroicons_solid:pencil-alt'"></mat-icon>
        <span class="ml-1.5 text-md font-medium whitespace-nowrap">Edit</span>
    </ng-container>
    <ng-container *ngIf="!Status.length">
        <mat-icon
            class="icon-size-5"
            [svgIcon]="'heroicons_solid:plus-circle'"></mat-icon>
        <span class="ml-1.5 text-md font-medium whitespace-nowrap">Add</span>
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
                            placeholder="Enter tag name"
                            (input)="filterPanel($event)"
                            (keydown)="filterTagsInputKeyDown($event)"
                            [maxLength]="30"
                            #newPanelInput>
                    </div>
                </div>
                <button
                    class="ml-1"
                    mat-icon-button
                    (click)="toggleTagsEditMode()">
                    <mat-icon
                        *ngIf="!tagsEditMode"
                        class="icon-size-5"
                        [svgIcon]="'heroicons_solid:pencil-alt'"></mat-icon>
                    <mat-icon
                        *ngIf="tagsEditMode"
                        class="icon-size-5"
                        [svgIcon]="'heroicons_solid:check'"></mat-icon>
                </button>
            </div>
            <div
                class="flex flex-col max-h-64 py-2 border-t overflow-y-auto">
                <ng-container *ngIf="!tagsEditMode">
                    <ng-container *ngFor="let tag of filteredTags">
                        <div
                            class="flex items-center h-10 min-h-10 px-4 cursor-pointer hover:bg-hover"
                            (click)="toggleContactTag(tag)"
                            matRipple>
                            <mat-checkbox
                                class="flex items-center h-10 min-h-10 pointer-events-none"
                                [checked]="Status.includes(tag.id)"
                                [color]="'primary'"
                                [disableRipple]="true">
                            </mat-checkbox>
                            <div class="ml-1">{{tag.title}}</div>
                        </div>
                    </ng-container>
                </ng-container>
                <ng-container *ngIf="tagsEditMode">
                    <div class="py-2 space-y-2">
                        <ng-container *ngFor="let tag of filteredTags; trackBy: trackByFn">
                            <div class="flex items-center">
                                <mat-form-field class="fuse-mat-dense fuse-mat-no-subscript w-full mx-4">
                                    <input
                                        matInput
                                        [value]="tag.title"
                                        (input)="updateTagTitle(tag, $event)">
                                    <button
                                        mat-icon-button
                                        (click)="deleteTag(tag)"
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
                
                <div
                    class="flex items-center h-10 min-h-10 -ml-0.5 pl-4 pr-3 leading-none cursor-pointer hover:bg-hover"
                    *ngIf="shouldShowCreateTagButton(newPanelInput.value)"
                    (click)="createTag(newPanelInput.value); newPanelInput.value = ''"
                    matRipple>
                    <mat-icon
                        class="mr-2 icon-size-5"
                        [svgIcon]="'heroicons_solid:plus-circle'"></mat-icon>
                    <div class="break-all">Create "<b>{{newPanelInput.value}}</b>"</div>
                </div>
            </div>
        </div>
    </ng-template>
</div>
</div>