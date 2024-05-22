import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
import { EspApiService } from '../../services/esp-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Log } from '../../interfaces/Logs.interface';




@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [BaseChartDirective, HttpClientModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  logs: Log[] = [];



  constructor(
    private apiEsp: EspApiService
  ) { }


  ngOnInit(): void {
    this.apiEsp.getLogs().subscribe(response =>{
      this.logs = response
      this.updateChart();
    });

    
  }


  @ViewChild(BaseChartDirective, { static: true }) chart?: BaseChartDirective;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Logs',
        font: {
          size: 20,
        },
        position: 'top',
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount'
        },
        suggestedMin: -0.5,
        suggestedMax: 1.5
      }
    },
  };



  updateChart() {

    const dataset = this.getDataSets(this.logs);


    if (this.chart && dataset) {

      console.log(dataset[0].data);

      this.chart.labels = dataset[1].labels;
      this.chart.datasets = [{
        label: dataset[1].endpoint,
        data: dataset[1].data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }];

      this.chart?.ngOnChanges({} as SimpleChanges);
    }

  }




  uniqueEndpoints(data: Log[]) {
    const endpoints = new Set<string>();
    data.forEach(log => endpoints.add(log.endpoint));
    return Array.from(endpoints);
  }


  filterAndSortLogs(data: Log[], endpoint: string) {
    return data
      .filter(log => log.endpoint === endpoint)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }



  getDataSets(logs: Log[]) {
    const endpoints = this.uniqueEndpoints(logs);


    console.log(`Endpoint : ${endpoints}`)

    const datasets = endpoints.map(endpoint => {
      const filteredData = this.filterAndSortLogs(logs, endpoint);
      const labels : string []= [];
      const data : number[] = [];
      const count: { [key: string]: number } = {};

      filteredData.forEach(log => {
        if (!count.hasOwnProperty(log.hora)) {
          count[log.hora] = (log.status === 200) ? 1 : 0;  // 1 para éxito, 0 para fallo
          labels.push(log.hora);
        }
      });

      labels.forEach(label => {
        data.push(count[label]);
      });


      return {
        endpoint,
        labels,
        data
      };
    });

    return datasets;
  }




}
