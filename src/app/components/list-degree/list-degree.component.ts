import { Component } from '@angular/core';

@Component({
  selector: 'app-list-degree',
  templateUrl: './list-degree.component.html',
  styleUrls: ['./list-degree.component.css']
})
export class ListDegreeComponent {

  cards = [
    { number: '1', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '2', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '3', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '4', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    // Add more card objects as needed
  ];

  onButtonClick(card: any, buttonType: string) {
    card.activeButton = buttonType; // Set the active button for each card individually
    console.log(`Button ${buttonType} clicked for card ${card.number}`);
    // Add any additional logic, like opening a modal or sending data
  }

  
  toggleMenu(card: any): void {
    card.isMenuOpen = !card.isMenuOpen; // Toggle the `isMenuOpen` flag
  }

  // Method to handle menu actions (Delete, Edit, Download)
  menuAction(action: string): void {
    console.log(`Action: ${action}`);
    // Add custom logic for each action here (e.g., opening modals, handling downloads, etc.)
  }

  buttons: string[] = ['كشف الحضور', 'كشف السلوكيات', 'كشف التفاعل', 'كشف المتابعة'];
  activeButton: number = 3; // Default active button index (for example, the last button)

  setActiveButton(index: number): void {
    this.activeButton = index;
  }

}
