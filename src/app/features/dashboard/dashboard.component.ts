import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = [
    { title: 'Total Providers', value: '0', icon: 'cloud', color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Instances', value: '0', icon: 'server', color: 'bg-green-100 text-green-600' },
    { title: 'Total Storage', value: '0 TB', icon: 'database', color: 'bg-purple-100 text-purple-600' },
    { title: 'Network Traffic', value: '0 GB', icon: 'activity', color: 'bg-amber-100 text-amber-600' },
  ];

  recentActivity = [
    { id: 1, action: 'New provider registered', time: '2 minutes ago', icon: 'plus-circle' },
    { id: 2, action: 'Instance started', time: '10 minutes ago', icon: 'play-circle' },
    { id: 3, action: 'Security update applied', time: '1 hour ago', icon: 'shield-check' },
    { id: 4, action: 'New deployment', time: '3 hours ago', icon: 'upload' },
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize dashboard data
  }
}
