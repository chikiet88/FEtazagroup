<mat-form-field class="fuse-mat-no-subscript fuse-mat-emphasized-affix w-full">
<div class="text-secondary" matPrefix>
  Role
</div>
<mat-select [(value)]="contact.Role" (selectionChange)="ChangeRole(contact,$event)">
  <div class="p-3 border-b"><input matInput placeholder="Tìm Kiếm" #searchSelect></div>
  <mat-option *ngFor="let item of Role | keyvalue| timkiem : searchSelect.value:'value'"
    [value]="item.key">
    {{item.value}}
  </mat-option>
  <mat-option *ngIf="(Role | keyvalue| timkiem : searchSelect.value:'value').length==0">
    Không Tìm Thấy
  </mat-option>
</mat-select>
</mat-form-field>