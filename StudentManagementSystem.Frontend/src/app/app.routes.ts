import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
 canActivate: [authGuard]
  },
  {
    path: 'students',
    loadComponent: () => import('./components/student-list/student-list.component').then(m => m.StudentListComponent),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'dashboard' }
];
