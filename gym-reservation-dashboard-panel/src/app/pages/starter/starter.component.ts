// starter.component.ts
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService } from 'src/app/core/services/DashboardService';
import { DashboardData } from 'src/app/core/interfaces/DashboardData';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    NgChartsModule
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {

  // Chart data
  barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  pieChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  doughnutChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  radarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  // Chart types
  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  pieChartType: ChartType = 'pie';
  doughnutChartType: ChartType = 'doughnut';
  radarChartType: ChartType = 'radar';

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  constructor(private dashboardService: DashboardService) { }

async  ngOnInit() {
   await this.loadDashboardData();
  }

  async loadDashboardData() {

    const observable = this.dashboardService.getDashboardData();
    var res: any = await lastValueFrom(observable);
     
    if (res) {
      this.updateCharts(res);
    }

  }

  private updateCharts(data: any): void {
    
    // Bar Chart - Subscription Counts
   this.barChartData = {
  labels: data.SubscriptionCounts.Labels,
  datasets: [{
    data: data.SubscriptionCounts.Data,
    label: 'Active Subscriptions',
    backgroundColor: 'rgba(69, 235, 54, 0.6)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
};

this.lineChartData = {
  labels: data.ReservationStats.Labels,
  datasets: [{
    data: data.ReservationStats.Data,
    label: 'Monthly Reservations',
    fill: false,
    tension: 0.4,
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)'
  }]
};

this.pieChartData = {
  labels: ['Active Classes', 'Cancelled Classes'],
  datasets: [{
    data: [data.CancellationStats.ActiveCount, data.CancellationStats.CancelledCount],
    backgroundColor: [
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 99, 132, 0.6)'
    ]
  }]
};

this.doughnutChartData = {
  labels: ['Total Reservations', 'Active Subscriptions'],
  datasets: [{
    data: [data.TotalReservations, data.SubscriptionCounts.Data.reduce((a:any, b:any) => a + b, 0)],
    backgroundColor: [
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)'
    ]
  }]
};

this.radarChartData = {
  labels: ['Active Subscriptions', 'Total Reservations', 'Active Classes', 'Active Members'],
  datasets: [{
    data: [
      data.RadarMetrics.ActiveSubscriptions,
      data.RadarMetrics.TotalReservations,
      data.RadarMetrics.ActiveClasses,
      data.RadarMetrics.ActiveMembers
    ],
    label: 'Performance Metrics',
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    pointBackgroundColor: 'rgba(255, 99, 132, 1)'
  }]
};

  }
}