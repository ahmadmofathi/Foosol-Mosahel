import { Component } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-exam-paper',
  templateUrl: './exam-paper.component.html',
  styleUrls: ['./exam-paper.component.css']
})
export class ExamPaperComponent {

  headerBox1Visible = true;
  headerBox2Visible = true;
  headerBox3Visible = true;

  public Editor = ClassicEditor;
  public questionContent: string = '';
  public instructionContent: string = '';
  public questionGrade: number = 0;

 
  // Close header box
  closeHeaderBox(boxNumber: number) {
    if (boxNumber === 1) this.headerBox1Visible = false;
    if (boxNumber === 2) this.headerBox2Visible = false;
    if (boxNumber === 3) this.headerBox3Visible = false;
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
  

  addQuestion() {
    // Handle question addition logic
    console.log("Question Content:", this.questionContent);
    console.log("Instruction Content:", this.instructionContent);
    console.log("Question Grade:", this.questionGrade);
  }


  addOption() {
    const newOptionId = String.fromCharCode(97 + this.options.length); // generates 'e', 'f', etc.
    this.options.push({ id: newOptionId, label: 'ن', answer: '', isCorrect: false });
  }


  toggleCheck(option:any) {
    option.checked = !option.checked;
  }
  options = [
    { id: 'a', label: 'أ', answer: '', isCorrect: false },
    { id: 'b', label: 'ب', answer: '', isCorrect: false },
    { id: 'c', label: 'ج', answer: '', isCorrect: false },
    { id: 'd', label: 'د', answer: '', isCorrect: false }
  ];

  feedback: string | null = null;
  selectedOptionId: string | null = null;

  // Function to add a new option
 
  // Function to set the correct answer
  setCorrectAnswer(optionId: string) {
    this.options.forEach(option => {
      option.isCorrect = option.id === optionId;
    });
  }

  // Function to check the answer
  checkAnswer() {
    const correctOption = this.options.find(option => option.isCorrect);
    const selectedOption = this.options.find(option => option.id === this.selectedOptionId);

    if (selectedOption) {
      if (selectedOption === correctOption) {
        this.feedback = 'Correct!';
      } else {
        this.feedback = 'Wrong answer. Try again!';
      }
    } else {
      this.feedback = 'Please select an answer.';
    }
  }

}
