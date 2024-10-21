import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  students: any[] = [
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    // add more students
  ];

  dropdownIndex: number | null = null; // Keeps track of the currently open dropdown

  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  toggleDropdown(index: number): void {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null; // Close dropdown if clicked again
    } else {
      this.dropdownIndex = index; // Open dropdown for clicked image
    }
  }

  // Optional: Close the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.student-info')) {
      this.dropdownIndex = null; // Close the dropdown if the click is outside
    }
  }
}
