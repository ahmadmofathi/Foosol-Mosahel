import { Component } from '@angular/core';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent {
  subjects: string[] = ['احياء', 'اللغة العربية', 'توحيد'];
  selectedSubject: string = '';

  // Data for the "الصف" container
  classes: string[] = ['ثالثة متوسط', 'أولي متوسط', 'ثانية متوسط'];
  selectedClass: string = '';
  selectSubject(subject: string) {
    this.selectedSubject = subject;
  }

  // Custom selection logic for classes
  selectClass(cls: string) {
    this.selectedClass = cls;
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

}


