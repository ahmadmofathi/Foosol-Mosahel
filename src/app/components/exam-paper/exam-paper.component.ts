import { Component } from '@angular/core';

@Component({
  selector: 'app-exam-paper',
  templateUrl: './exam-paper.component.html',
  styleUrls: ['./exam-paper.component.css']
})
export class ExamPaperComponent {

  headerBox1Visible = true;
  headerBox2Visible = true;
  headerBox3Visible = true;

  // Question data structure
  questions = [
    {
      id: 1,
      text: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ];

  // Close header box
  closeHeaderBox(boxNumber: number) {
    if (boxNumber === 1) this.headerBox1Visible = false;
    if (boxNumber === 2) this.headerBox2Visible = false;
    if (boxNumber === 3) this.headerBox3Visible = false;
  }

  // Add a new question
  addQuestion() {
    const newQuestion = {
      id: this.questions.length + 1,
      text: '',
      options: [{ id: 1, text: '' }]
    };
    this.questions.push(newQuestion);
  }

  // Add a new option to a question
  addOption(questionId: number) {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      const newOptionId = question.options.length + 1;
      question.options.push({ id: newOptionId, text: '' });
    }
  }

  // Remove an option from a question
  removeOption(questionId: number, optionId: number) {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.options = question.options.filter(option => option.id !== optionId);
    }
  }

  // Preview functionality
  preview() {
    console.log('Preview clicked!');
    // Implement preview logic as needed
  }

  icons = [
    { src: '../../../assets/images/p1.png', alt: 'Icon 1', label: 'املأ الفراغات داخل الصورة' },
    { src: '../../../assets/images/p2.png', alt: 'Icon 2', label: 'سؤال مفتوح (مقالي)' },
    { src: '../../../assets/images/p3.png', alt: 'Icon 3', label: 'أكمل النقاط الفارغة' },
    { src: '../../../assets/images/p4.png', alt: 'Icon 4', label: 'وصل البيانات المتطابقة' },
    { src: '../../../assets/images/p5.png', alt: 'Icon 5', label: 'ضع علامة صح أو خطأ' },
    { src: '../../../assets/images/p6.png', alt: 'Icon 6', label: 'اختر الاجابة من متعدد' },
    { src: '../../../assets/images/p7.png', alt: 'Icon 7', label: 'الفرز والتصنيف' }
  ];

  // Track the active button
  activeButton: number | null = null;

  // Set the clicked button as active
  selectButton(index: number) {
    this.activeButton = index;
  }
  
}
