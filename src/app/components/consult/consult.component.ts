import { Component, Directive, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css'],
})
export class ConsultComponent {
  private apiUrl = 'https://parallelum.com.br/fipe/api/v1';
  vehicleType: string = '';
  vehicleBrand: any = [];
  vehicleModels: any = [];
  vehicleYear: any = [];
  vehicleValue: any = [];
  brandCode: string = '';
  modelCode: string = '';
  yearCode: string = '';

  valueEntered: any; //valor digitado
  valueFipe: any;

  numberPercentage: any;
  textPercentage: any;
  colorPercentage: string = '';
  alertInfoText: string = '';
  alertInfoClass: string = '';
  showElement: boolean = false;

  constructor(private http: HttpClient) {}
  // realizar o get para popular os campos --- INICO
  getBrands(): void {
    this.http
      .get(`${this.apiUrl}/${this.vehicleType}/marcas`)
      .subscribe((vehicle) => {
        this.vehicleBrand = vehicle;
      });
  }

  getModels(): void {
    this.http
      .get(
        `${this.apiUrl}/${this.vehicleType}/marcas/${this.brandCode}/modelos`
      )
      .subscribe((model) => {
        this.vehicleModels = model;
      });
  }

  getYears() {
    this.http
      .get(
        `${this.apiUrl}/${this.vehicleType}/marcas/${this.brandCode}/modelos/${this.modelCode}/anos`
      )
      .subscribe((year) => {
        this.vehicleYear = year;
      });
  }

  getValues() {
    this.http
      .get(
        `${this.apiUrl}/${this.vehicleType}/marcas/${this.brandCode}/modelos/${this.modelCode}/anos/${this.yearCode}`
      )
      .subscribe((value) => {
        this.vehicleValue = value;
        console.log(this.vehicleValue);
      });
  }
  // --------------FIM-----------------------------

  // calcular a variação de aumento do percentual e exibir resultado
  resultPercentage() {
    if (this.valueEntered && this.valueFipe) {
      // mostra todos os elementos do resultado
      this.showElement = true;
      // convertendo valores da tabela FIPE de string p/ number
      this.valueFipe = parseFloat(
        this.vehicleValue.Valor.replace('R$', '')
          .replace('.', '')
          .replace(',', '.')
      );

      let calculatePercentage =
        ((this.valueEntered - this.valueFipe) / this.valueFipe) * 100;

      if (calculatePercentage >= 10) {
        this.textPercentage = 'Valor do veículo acima da tabela FIPE';
        this.numberPercentage = `${Math.abs(calculatePercentage).toFixed(1)}%`;
        this.colorPercentage = '#FF3333';
        this.alertInfoClass = 'alert alert-danger';
        this.alertInfoText = 'Valor acima do mercado';
      }
      if (calculatePercentage <= -10) {
        this.textPercentage = 'Valor do veículo abaixo da tabela FIPE';
        this.numberPercentage = `${Math.abs(calculatePercentage).toFixed(1)}%`;
        this.colorPercentage = '#4D9900';
        this.alertInfoClass = 'alert alert-info';
        this.alertInfoText = 'Valor abaixo do mercado';
      }
      if (calculatePercentage >= -9.99 && calculatePercentage <= 9.99) {
        this.textPercentage = 'Valor do veículo na média da tabela FIPE';
        this.numberPercentage = `${Math.abs(calculatePercentage).toFixed(2)}%`;
        this.colorPercentage = '#FFD21C';
        this.alertInfoClass = 'alert alert-warning';
        this.alertInfoText = 'Valor de mercado';
      }
    }
  }
}
