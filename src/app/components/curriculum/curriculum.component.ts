import { Component } from '@angular/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent {
  value: number = 1; // Starting value

  value2: number = 1;

  increaseValue() {
    this.value++;
  }
  
  decreaseValue() {
    if (this.value > 0) { // Optional: Prevents value from going negative
      this.value--;
    }
  }

  increaseValue2() {
    this.value2++;
  }
  
  decreaseValue2() {
    if (this.value2 > 0) { // Optional: Prevents value from going negative
      this.value2--;
    }
  }

  
  
}
