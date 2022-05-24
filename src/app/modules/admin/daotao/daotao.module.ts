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
import { TailieunguonComponent } from './tailieunguon/tailieunguon.component';
import { BaihocComponent } from './baihoc/baihoc.component';
import { LophocComponent } from './lophoc/lophoc.component';
import { CauhoiComponent } from './cauhoi/cauhoi.component';
import { KythiComponent } from './kythi/kythi.component';
import { DethiComponent } from './dethi/dethi.component';
import { YeucaudaotaoComponent } from './yeucaudaotao/yeucaudaotao.component';
export const DaotaoRoutes: Route[] = [
    {
        path: '',
        component: DaotaoComponent,
        children: [
            { path: 'tailieunguon', component: TailieunguonComponent },
            { path: 'baihoc', component: BaihocComponent },
            { path: 'lophoc', component: LophocComponent },
            { path: 'cauhoi', component: CauhoiComponent },
            { path: 'dethi', component: DethiComponent },
            { path: 'kythi', component: KythiComponent },
            { path: 'yeucaudaotao', component: YeucaudaotaoComponent },

            
        ],
    },
];
@NgModule({
    declarations: [
        DaotaoComponent,
        TailieunguonComponent,
        BaihocComponent,
        LophocComponent,
        CauhoiComponent,
        DethiComponent,
        KythiComponent,
        YeucaudaotaoComponent
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
    ],
})
export class DaotaoModule {}
