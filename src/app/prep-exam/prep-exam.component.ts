import { Component } from '@angular/core';

@Component({
  selector: 'app-prep-exam',
  templateUrl: './prep-exam.component.html',
  styleUrls: ['./prep-exam.component.css']
})
export class PrepExamComponent {
  isMenuVisible: boolean = false; // Initially hidden

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Toggle the menu visibility
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
