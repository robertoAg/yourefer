import { EventEmitter, OnChanges, Output } from '@angular/core';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component(
  {
    selector: 'app-filter',
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.css']
  }
)
export class FilterComponent implements OnChanges {

  @Input() items: string[];
  filtered: string[];

  @Output() filtering = new EventEmitter<any>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.items = changes.items.currentValue;
    this.filtered = [...this.items];
  }

  // tslint:disable-next-line:typedef
  selectAll() {
    this.filtered = [...this.items];
  }
  // tslint:disable-next-line:typedef
  select(item) {
    if (this.filtered.length !== this.items.length) {
      if (this.filtered.indexOf(item) > -1) {
        this.filtered.splice(this.filtered.indexOf(item), 1);
        if (!this.filtered.length) {
          this.selectAll();
        }
      } else {
        this.filtered.push(item);
      }
    } else {
      this.filtered = [];
      this.filtered.push(item);
    }
    this.filtering.emit(this.filtered);
  }
}
