import { Component } from '@angular/core';

@Component({
  selector: 'app-main-skills',
  templateUrl: './main-skills.component.html',
  styleUrls: ['./main-skills.component.css']
})
export class MainSkillsComponent {

  tableData = Array(1).fill(null).map(() =>
    Array(9).fill(null).map(() => ({ status: 'false', dropdownOpen: false }))
  );
  
  toggleDropdown(event: MouseEvent, rowIndex: number, colIndex: number): void {
    event.stopPropagation();
    // Toggle dropdown open state for the specific cell
    this.tableData[rowIndex][colIndex].dropdownOpen = !this.tableData[rowIndex][colIndex].dropdownOpen;
  }
  
  setStatus(rowIndex: number, colIndex: number, status: string): void {
    // Update the cell's status and close the dropdown
    this.tableData[rowIndex][colIndex].status = status;
    this.tableData[rowIndex][colIndex].dropdownOpen = false;
  }
}
