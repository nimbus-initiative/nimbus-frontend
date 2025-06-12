import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BaremetalComponent } from './baremetal/baremetal.component';
import { SettingsComponent } from './settings/settings.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: 'providers', 
    loadChildren: () => import('./providers/providers.module').then(m => m.ProvidersModule)
  },
  { path: 'baremetal', component: BaremetalComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' },
];
