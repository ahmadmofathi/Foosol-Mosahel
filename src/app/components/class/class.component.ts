import { Component } from '@angular/core';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent {

  allSkills: string[] = ['دراسات اجتماعيه', 'علوم', 'رياضيات'];
  selectedSkills: string[] = []; // Selected skills

  // Handle skill selection from the checkbox
  onSkillSelect(skill: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // Add skill if checked
      this.addSkill(skill);
    } else {
      // Remove skill if unchecked
      this.removeSkill(skill);
    }
  }

  // Add a skill from the input field
  addSkill(skill: string) {
    if (skill && !this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
  }

  // Remove a selected skill
  removeSkill(skill: string) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  navOpen = false;

  toggleNav() {
    this.navOpen = !this.navOpen; // Toggle navigation visibility
  }

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
}
