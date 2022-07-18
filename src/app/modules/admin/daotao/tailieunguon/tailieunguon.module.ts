import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialExampleModule } from 'material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TailieunguonComponent } from './tailieunguon.component';
import { TailieunguonResolve } from './tailieunguon.resolver';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'app/shared/shared.module';
import { TailieunguonListComponent } from './tailieunguon-list/tailieunguon-list.component';
import { FolderListComponent } from './folder-list/folder-list.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { GoogleChartsModule } from 'angular-google-charts';  
export const TailieunguonRoutes: Route[] = [
    {
        path: '',
        component: TailieunguonComponent,
        resolve:{data:TailieunguonResolve},
        children:[
            {path:'',component:TailieunguonListComponent},
            {path:'folder-list', component: FolderListComponent}
        ]
        
    },
];
@NgModule({
    declarations: [TailieunguonComponent, TailieunguonListComponent, FolderListComponent, FileDetailComponent],
    imports: [
        RouterModule.forChild(TailieunguonRoutes),
        CommonModule,
        MaterialExampleModule,
        ReactiveFormsModule,
        FormsModule,
        CKEditorModule,
        FindbyidModule,
        NgxDropzoneModule,
        SharedModule,
        GoogleChartsModule

    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TailieunguonModule {}
