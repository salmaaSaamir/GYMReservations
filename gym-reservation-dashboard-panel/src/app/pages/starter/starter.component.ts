import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

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
export class StarterComponent {

  // Bar Chart
  barChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{ data: [30, 50, 40, 70], label: 'Sales' }]
  };
  barChartType: ChartType = 'bar';

  // Line Chart
  lineChartData: ChartConfiguration['data'] = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ data: [15, 25, 35, 45], label: 'Revenue' }]
  };
  lineChartType: ChartType = 'line';

  // Pie Chart
  pieChartData: ChartConfiguration['data'] = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
    datasets: [{ data: [300, 500, 100] }]
  };
  pieChartType: ChartType = 'pie';

  // Doughnut Chart
  doughnutChartData: ChartConfiguration['data'] = {
    labels: ['Online', 'Offline'],
    datasets: [{ data: [350, 150] }]
  };
  doughnutChartType: ChartType = 'doughnut';

  // Radar Chart
  radarChartData: ChartConfiguration['data'] = {
    labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
    datasets: [
      { data: [20, 10, 4, 2], label: 'Person A' },
      { data: [10, 15, 20, 25], label: 'Person B' }
    ]
  };
  radarChartType: ChartType = 'radar';
}
