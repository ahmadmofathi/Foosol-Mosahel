import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-curriculum2',
  templateUrl: './curriculum2.component.html',
  styleUrls: ['./curriculum2.component.css']
})
export class Curriculum2Component {

  weeks = Array.from({ length: 9 }, (_, index) => ({
    tasks: ['', '', ''],
    activeButton: '',
    isMenuOpen: false,
    index: index,
  }));

  selectedWeek: any;

  onButtonClick(week: any, action: string) {
    if (action === 'view') {
      this.selectedWeek = week; // Store the selected week for the modal
    }
  }

  activeButton: string = 'save';
  setActive(button: string) {
    this.activeButton = button;
  }


  // onButtonClick(week: any, action: string): void {
  //   week.activeButton = action; // Set the active button based on the clicked action
  //   // You can add other logic here to handle what happens when each button is clicked
  //   console.log(`Button clicked for week ${week}: ${action}`);
  // }

  toggleMenu(week: any): void {
    week.isMenuOpen = !week.isMenuOpen; // Toggle the `isMenuOpen` flag
  }

  // Method to handle menu actions (Delete, Edit, Download)
  menuAction(action: string): void {
    console.log(`Action: ${action}`);
    // Add custom logic for each action here (e.g., opening modals, handling downloads, etc.)
  }

  confirmDelete(): void {
    console.log('Delete confirmed');
    // Implement your delete logic here
    // Close the modal after deletion if needed
  }

  @Input() weekNumber: number = 1;
  startDate: string | null = null;
  endDate: string | null = null;

  // Example student data
  students = ['اسامة علي محمد', 'اسامة علي خالد', 'اسماء علي خالد', 'اسامة علي خالد', 'اسامة علي خالد'];




}
