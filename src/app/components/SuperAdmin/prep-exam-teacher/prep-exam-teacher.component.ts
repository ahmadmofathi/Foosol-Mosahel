import { Component } from '@angular/core';

@Component({
  selector: 'app-prep-exam-teacher',
  templateUrl: './prep-exam-teacher.component.html',
  styleUrls: ['./prep-exam-teacher.component.css']
})
export class PrepExamTeacherComponent {

  isMenuVisible: boolean = false; // Initially hidden

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Toggle the menu visibility
  }

  tests2 = []; // Assuming this is populated with your data
  isDropdownOpen: boolean[] = []; // Array to track dropdown states

  toggleDropdown2(index: number) {
      this.isDropdownOpen[index] = !this.isDropdownOpen[index]; // Toggle the state for the specific index
  }

  cards = Array(9).fill({});

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }
  terms = [1, 2, 3]; // Example data for terms
  tests = [
    { title: 'اختبار آخر الأسبوع', score: 50},
    { title: 'اختبار الشهر', score: 50 },
    { title: 'اختبار آخر الترم', score: 50 }
];

dropMenu = false

// toggleDropdown() {
//   this.dropMenu = !this.dropMenu;

// }

students: any[] = [
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  // add more students
];

dropdownIndex: number | null = null;


toggleDropdown(index: number): void {
  this.dropdownIndex = this.dropdownIndex === index ? null : index; // Toggle the dropdown
}

}
