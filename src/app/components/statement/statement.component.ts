import { Component } from '@angular/core';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})
export class StatementComponent {
  columns = Array.from({ length: 31 }, (_, i) => i + 1); // 31 columns
  rows = Array.from({ length: 10 }, (_, i) => i + 1);    // 18 rows


}
