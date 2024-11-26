import { Component } from '@angular/core';

@Component({
  selector: 'app-ques',
  templateUrl: './ques.component.html',
  styleUrls: ['./ques.component.css']
})
export class QuesComponent {

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
  selectAll: boolean = false;
  option1: boolean = false;
  option2: boolean = false;
  option3: boolean = false;

  toggleSelectAll() {
    this.option1 = this.selectAll;
    this.option2 = this.selectAll;
    this.option3 = this.selectAll;
  }

  updateSelectAll() {
    this.selectAll = this.option1 && this.option2 && this.option3;
  }

  toggleStyle(event: any) {
    const divElement = event.target.closest('.custom-box'); // Find the closest div with class 'custom-box'
    
    // Toggle styles
    if (divElement.style.backgroundColor === 'rgb(0, 26, 114)') { // if it's already the '001A72'
      divElement.style.backgroundColor = '#D9D9D9';
      divElement.style.color = '#001A72';
    } else {
      divElement.style.backgroundColor = '#001A72';
      divElement.style.color = '#D9D9D9';
    }
  }

}
