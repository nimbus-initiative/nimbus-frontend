import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProvidersComponent } from './providers/providers.component';
import { BaremetalComponent } from './baremetal/baremetal.component';
import { SettingsComponent } from './settings/settings.component';
import { NewProviderComponent } from './providers/new-provider/new-provider.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'providers/new', component: NewProviderComponent },
  { path: 'baremetal', component: BaremetalComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' },
];
