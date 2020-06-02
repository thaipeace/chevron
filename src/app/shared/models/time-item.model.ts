export class TimeItemModel {
  label: string;
  value: number;

  constructor(number) {
    this.value = number;
    this.label = (this.value < 10 ? '0' + this.value : this.value) + ':00';
  }
}
