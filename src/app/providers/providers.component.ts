import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

export interface Provider {
  id: string;
  name: string;
  type: 'baremetal' | 'aws' | 'gcp' | 'azure' | 'other';
  status: 'active' | 'inactive' | 'error' | 'pending' | 'refreshing';
  lastSeen?: Date;
  bmcAddress?: string;
  hasAgent: boolean;
  cpuCores?: number;
  memoryGB?: number;
  storageGB?: number;
  location?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDividerModule,
    MatToolbarModule,
    HttpClientModule,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  loading = false;
  error: string | null = null;
  private http = inject(HttpClient);
  private readonly apiUrl = environment ? `${environment.apiUrl}/providers` : '/api/providers';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.error = null;

    this.http.get<Provider[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error loading providers:', error);
        this.error = 'Failed to load providers. Please try again.';
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe((providers: Provider[]) => {
      this.providers = providers.map(provider => ({
        ...provider,
        lastSeen: provider.lastSeen ? new Date(provider.lastSeen) : undefined,
        createdAt: provider.createdAt ? new Date(provider.createdAt) : undefined,
        updatedAt: provider.updatedAt ? new Date(provider.updatedAt) : undefined
      }));
    });
  }

  refreshProviders(): void {
    this.loadProviders();
  }

  refreshProvider(id: string): void {
    const provider = this.providers.find(p => p.id === id);
    if (!provider) return;

    provider.status = 'refreshing';
    
    this.http.get<Provider>(`${this.apiUrl}/${id}/refresh`).pipe(
      catchError(error => {
        console.error('Error refreshing provider:', error);
        this.snackBar.open('Failed to refresh provider', 'Dismiss', { duration: 3000 });
        provider.status = 'error';
        return of(null);
      })
    ).subscribe(updatedProvider => {
      if (updatedProvider) {
        const index = this.providers.findIndex(p => p.id === id);
        if (index !== -1) {
          this.providers[index] = {
            ...updatedProvider,
            lastSeen: updatedProvider.lastSeen ? new Date(updatedProvider.lastSeen) : undefined,
            updatedAt: new Date()
          };
        }
        this.snackBar.open('Provider refreshed successfully', 'Dismiss', { duration: 2000 });
      }
    });
  }

  confirmDelete(provider: Provider): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Provider',
        message: `Are you sure you want to delete ${provider.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProvider(provider.id);
      }
    });
  }

  deleteProvider(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting provider:', error);
        this.snackBar.open('Failed to delete provider', 'Dismiss', { duration: 3000 });
        return of(null);
      })
    ).subscribe(() => {
      this.providers = this.providers.filter(p => p.id !== id);
      this.snackBar.open('Provider deleted successfully', 'Dismiss', { duration: 2000 });
    });
  }

  viewProvider(id: string): void {
    this.router.navigate(['/providers', id]);
  }

  editProvider(id: string): void {
    this.router.navigate(['/providers', id, 'edit']);
  }

  addNewProvider(): void {
    this.router.navigate(['/providers/new']);
  }

  getProviderIcon(type: string): string {
    switch (type) {
      case 'aws':
        return 'cloud_queue';
      case 'gcp':
        return 'g_mobiledata';
      case 'azure':
        return 'cloud_queue';
      case 'baremetal':
        return 'dns';
      default:
        return 'cloud';
    }
  }

  getProviderType(type: string): string {
    return type === 'baremetal' ? 'Bare Metal' : type.toUpperCase();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'inactive':
        return 'accent';
      case 'error':
        return 'warn';
      case 'refreshing':
        return 'accent';
      default:
        return '';
    }
  }

  getLastSeen(date?: Date): string {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return this.datePipe.transform(date, 'medium') || date.toLocaleString();
  }
}
