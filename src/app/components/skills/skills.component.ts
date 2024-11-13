import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {

  skills: { id: number; description: string; className: string; subjectName: string; isNew?: boolean }[] = [
    { id: 1, description: 'معرفة عناصر المناخ', className: 'الثاني متوسط', subjectName: 'احياء' },
    { id: 2, description: 'معرفة عاصمة السعودية', className: 'الثاني متوسط', subjectName: 'احياء' }
  ];

  isTableView = false;
  toggleTable(){
    this.isTableView = !this.isTableView;
  }

  addNewSkill() {
    const newId = this.skills.length > 0 ? Math.max(...this.skills.map(skill => skill.id)) + 1 : 1;
    const newSkill = {
      id: newId,
      description: '', // Empty description with input box
      className: 'الثاني متوسط', // Default class
      subjectName: 'احياء', // Default subject
      isNew: true
    };
    this.skills.push(newSkill);
  }

  // Method to delete a skill by id
  deleteSkill(id: number) {
    this.skills = this.skills.filter(skill => skill.id !== id);
  }

  // Optional: Method to edit skill, e.g., for in-place editing
  editSkill(skill: any) {
    skill.isNew = true; // Set to editable mode if needed
  }

}
