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
    { title: 'اختبار اخر الاسبوع', score: 50, status: 'متاح' },
    { title: 'اختبار اخر الشهر', score: 50, status: 'مكتمل' },
    { title: 'اختبار اخر الترم', score: 50, status: 'منتهي' }
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'متاح':
        return 'available';
      case 'مكتمل':
        return 'limited';
      case 'منتهي':
        return 'unavailable';
      default:
        return '';
    }
  }
}
