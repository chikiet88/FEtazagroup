import { Route } from '@angular/router';
import { CauhoiComponent } from './cauhoi.component';
import { CauhoiResolver } from './cauhoi.resolvers';
import { CauhoiadminComponent } from './cauhoiadmin/cauhoiadmin.component';
import { FaqComponent } from './faq/faq.component';
import { HotroComponent } from './hotro/hotro.component';
import { HuongdanComponent } from './huongdan/huongdan.component';

export const cauhoiRoutes: Route[] = [
    {
        path: '',
        component: CauhoiComponent,
        resolve: {
            data: CauhoiResolver
        }
    },
    {
        path: 'faq', component: FaqComponent,
        resolve: {
            data: CauhoiResolver
        }
    },
    {
        path: 'huongdan', component: HuongdanComponent,
        resolve: {
            data: CauhoiResolver
        }
    },
    {
        path: 'hotro', component: HotroComponent,
        resolve: {
            data: CauhoiResolver
        }
    },
    {
        path: 'cauhoiadmin', component: CauhoiadminComponent,
        resolve: {
            data: CauhoiResolver
        }
    }
];
