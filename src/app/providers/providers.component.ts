import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface Provider {
  id: string;
  name: string;
  type: 'baremetal' | 'aws' | 'gcp' | 'azure';
  hasAgent: boolean;
  bmcAddress?: string;
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule
  ],
  template: `
    <div class="providers-container">
      <div class="header">
        <h2>Cloud & Bare Metal Providers</h2>
        <button mat-raised-button color="primary" (click)="addNewProvider()">
          <mat-icon>add</mat-icon>
          Add Provider
        </button>
      </div>

      <div class="providers-list">
        <mat-card *ngFor="let provider of providers" class="provider-card">
          <mat-card-header>
            <mat-card-title>{{ provider.name }}</mat-card-title>
            <mat-card-subtitle>
              {{ getProviderType(provider.type) }}
              <span class="agent-status" [class.agent-active]="provider.hasAgent">
                {{ provider.hasAgent ? 'With Agent' : 'No Agent' }}
              </span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="provider.bmcAddress" class="bmc-info">
              <mat-icon>dns</mat-icon>
              <span>{{ provider.bmcAddress }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary" (click)="viewProvider(provider.id)">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button color="accent" (click)="editProvider(provider.id)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </mat-card-actions>
        </mat-card>

        <div *ngIf="providers.length === 0" class="empty-state">
          <mat-icon class="empty-icon">cloud_off</mat-icon>
          <h3>No Providers Found</h3>
          <p>Get started by adding your first provider</p>
          <button mat-raised-button color="primary" (click)="addNewProvider()">
            <mat-icon>add</mat-icon>
            Add Provider
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .providers-container {
      padding: 16px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .providers-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .provider-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      
      .mat-mdc-card-header {
        padding-bottom: 8px;
      }
      
      .mat-mdc-card-content {
        flex-grow: 1;
        padding-top: 8px;
      }
      
      .mat-mdc-card-actions {
        padding: 8px;
      }
    }
    
    .agent-status {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      background-color: #f5f5f5;
      color: #666;
      
      &.agent-active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
    }
    
    .bmc-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
      margin-top: 8px;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      border: 2px dashed #e0e0e0;
      border-radius: 4px;
      
      .empty-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        margin-bottom: 16px;
        color: #9e9e9e;
      }
      
      h3 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 500;
      }
      
      p {
        margin: 0 0 16px;
        color: #757575;
      }
    }
  `]
})
export class ProvidersComponent {
  // Mock data - replace with actual API call
  providers: Provider[] = [
    {
      id: '1',
      name: 'Bare Metal Cluster 1',
      type: 'baremetal',
      hasAgent: false,
      bmcAddress: '192.168.1.100'
    },
    {
      id: '2',
      name: 'AWS Production',
      type: 'aws',
      hasAgent: true
    }
  ];

  constructor(private router: Router) {}

  getProviderType(type: string): string {
    const types: {[key: string]: string} = {
      'baremetal': 'Bare Metal',
      'aws': 'Amazon Web Services',
      'gcp': 'Google Cloud Platform',
      'azure': 'Microsoft Azure'
    };
    return types[type] || type;
  }

  addNewProvider() {
    this.router.navigate(['/providers/new']);
  }

  viewProvider(id: string) {
    // TODO: Navigate to provider details
    console.log('View provider:', id);
  }

  editProvider(id: string) {
    // TODO: Navigate to edit provider
    console.log('Edit provider:', id);
  }
}
