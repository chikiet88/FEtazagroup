import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialExampleModule } from 'material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { SharedModule } from 'app/shared/shared.module';
import { DaotaoComponent } from './daotao.component';
import { BaihocComponent } from './baihoc/baihoc.component';
import { LophocComponent } from './lophoc/lophoc.component';
import { CauhoiComponent } from './cauhoi/cauhoi.component';
import { KythiComponent } from './kythi/kythi.component';
import { DethiComponent } from './dethi/dethi.component';
import { YeucaudaotaoComponent } from './yeucaudaotao/yeucaudaotao.component';
import { DaotaoResolver } from './daotao.resolver';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { DaotaouploadComponent } from './daotaoupload/daotaoupload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

export const DaotaoRoutes: Route[] = [
    {
        path: '',
        component: DaotaoComponent,
        children: [
            { path: 'baihoc', component: BaihocComponent },
            { path: 'lophoc', component: LophocComponent },
            { path: 'cauhoi', component: CauhoiComponent },
            { path: 'dethi', component: DethiComponent },
            { path: 'kythi', component: KythiComponent },
            { path: 'yeucaudaotao', component: YeucaudaotaoComponent },
            { path: 'tailieunguon', loadChildren: () => import('app/modules/admin/daotao/tailieunguon/tailieunguon.module').then(m => m.TailieunguonModule) },
        ],
    },
];
@NgModule({
    declarations: [
        DaotaoComponent,
        BaihocComponent,
        LophocComponent,
        CauhoiComponent,
        DethiComponent,
        KythiComponent,
        YeucaudaotaoComponent,
        DaotaouploadComponent
    ],
    imports: [
        RouterModule.forChild(DaotaoRoutes),
        CommonModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MaterialExampleModule,
        CKEditorModule,
        ReactiveFormsModule,
        FormsModule,
        CustomModule,
        FindbyidModule,
        NgxDropzoneModule,
    ],
})
export class DaotaoModule {}
