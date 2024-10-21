import { Component } from '@angular/core';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
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
}

