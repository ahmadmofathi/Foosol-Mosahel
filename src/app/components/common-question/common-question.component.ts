import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-common-question',
  templateUrl: './common-question.component.html',
  styleUrls: ['./common-question.component.css']
})
export class CommonQuestionComponent {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  public Editor = ClassicEditor;
  public editorConfig = {
    placeholder: 'قم بكتابة الرد في هذا الجزء',
    toolbar: [
      'heading', '|', 'bold', 'italic', 'link', '|',
      'bulletedList', 'numberedList', 'blockQuote', '|',
      'undo', 'redo'
    ]
  };

isNavbarOpen = false;
isIconShow = false;
isSettingBarOpen= false;

openNav() {
  this.isNavbarOpen = !this.isNavbarOpen;
  this.showIcone();
}

showIcone(){
  this.isIconShow =true;
}

openSetting(){
  this.isSettingBarOpen = !this.isSettingBarOpen;
}

questions = [
  { title: '', answer: '', showAnswer: false },
  { title: '', answer: '', showAnswer: false },
];

toggleAnswer(index: number) {
  this.questions[index].showAnswer = !this.questions[index].showAnswer;
}

addNewQuestion() {
  this.questions.push({
    title: `سؤال ${this.questions.length + 1}`,
    answer: '',
    showAnswer: false,
  });
}

saveQuestions() {
  console.log('Questions saved:', this.questions);
  alert('تم حفظ المعلومات بنجاح');
}
}
