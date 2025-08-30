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

  isLoading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) { }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const observable = this.dashboardService.getDashboardData();
      const res: DashboardData = await lastValueFrom(observable);
      
      if (res) {
        this.updateCharts(res);
      } else {
        this.error = 'No data received from server';
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.error = 'Failed to load dashboard data';
    } finally {
      this.isLoading = false;
    }
  }
private updateCharts(data: any): void {
  console.log('Dashboard Data:', data);

  // Bar Chart - Subscription Counts
  this.barChartData = {
    labels: data.SubscriptionCounts?.Labels || [],
    datasets: [{
      data: data.SubscriptionCounts?.Data || [],
      label: 'Active Subscriptions',
      backgroundColor: '#ec407a',   // medium pink
      borderColor: '#ad1457',       // darker pink
      borderWidth: 1
    }]
  };

  // Line Chart - Monthly Reservations
  this.lineChartData = {
    labels: data.ReservationStats?.Labels || [],
    datasets: [{
      data: data.ReservationStats?.Data || [],
      label: 'Monthly Reservations',
      fill: false,
      tension: 0.4,
      borderColor: '#d81b60',             // deep rose pink
      backgroundColor: 'rgba(236, 64, 122, 0.2)', // soft transparent pink
      pointBackgroundColor: '#ec407a',    // medium pink
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#d81b60'
    }]
  };

  // Pie Chart - Class Cancellation Stats
  this.pieChartData = {
    labels: ['Active Classes', 'Cancelled Classes'],
    datasets: [{
      data: [
        data.CancellationStats?.ActiveCount || 0,
        data.CancellationStats?.CancelledCount || 0
      ],
      backgroundColor: [
        '#f8bbd0',  // light pink
        '#ec407a'   // medium pink
      ],
      hoverBackgroundColor: [
        '#f48fb1',  // soft hover pink
        '#ad1457'   // dark hover pink
      ]
    }]
  };

  // Doughnut Chart - Totals
  const totalSubscriptions = data.SubscriptionCounts?.Data?.reduce((a:any, b:any) => a + b, 0) || 0;
  this.doughnutChartData = {
    labels: ['Total Reservations', 'Active Member Subscriptions'],
    datasets: [{
      data: [
        data.TotalReservations || 0,
        totalSubscriptions
      ],
      backgroundColor: [
        'rgba(248, 187, 208, 0.7)', // soft light pink
        'rgba(236, 64, 122, 0.7)'   // medium pink
      ],
      hoverBackgroundColor: [
        'rgba(248, 187, 208, 1)',   // full light pink
        'rgba(236, 64, 122, 1)'     // strong medium pink
      ]
    }]
  };

  // Radar Chart - Performance Metrics
  this.radarChartData = {
    labels: ['Total Reservations', 'Active Classes', 'Active Members'],
    datasets: [{
      data: [
        data.RadarMetrics?.TotalReservations || 0,
        data.RadarMetrics?.ActiveClasses || 0,
        data.RadarMetrics?.ActiveMembers || 0
      ],
      label: 'Performance Metrics',
      backgroundColor: 'rgba(236, 64, 122, 0.2)',  // soft transparent pink
      borderColor: '#d81b60',                      // rose pink
      pointBackgroundColor: '#ec407a',             // medium pink
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ad1457'
    }]
  };
}

  refreshData() {
    this.loadDashboardData();
  }
}