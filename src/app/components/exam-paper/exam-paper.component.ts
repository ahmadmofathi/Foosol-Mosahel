import { Component, Input } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

interface AnswerOption  {
  id: number;
  text: string;
}

interface Item {
  text: string;

}

// Define the structure for a category, which includes an array of items
interface Category {
  name: string;
  items: Item[];
  newItemText?: string; // For entering new item text dynamically
  editMode?: boolean;
}


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

  answerOptions: AnswerOption[] = [
    { id: 1, text: 'True' },   // Default option for True
    { id: 2, text: 'False' }   // Default option for False
  ];
  selectedAnswerId: number | null = null; 
  feedbackMessage: string = ''; 
  correctAnswerId: number | null = null; 

    public editorConfig: any = {
    toolbar: [
      'heading', '|', 
      'bold', 'italic', 'underline', '|', 
      'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
      'bulletedList', 'numberedList', '|',
      'link', 'undo', 'redo'
    ],
  };

  isArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  }

  updateAlignmentBasedOnLanguage() {
    if (this.isArabic(this.questionContent)) {
      this.editorConfig.alignment = {
        options: ['right']
      };
    } else {
      this.editorConfig.alignment = {
        options: ['left']
      };
    }
  }

 
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



  addQuestion2() {
    this.questions.push({ part1: '', part2: '' });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

    // Start MAtching Functiions

  questions = [{ part1: '', part2: '' }];
  shuffledPart1: string[] = [];
  shuffledPart2: string[] = [];
  selectedAnswers: (string | null)[] = [];
  correctCount: number = 0;
  incorrectCount: number = 0;
  isSubmitted: boolean = false;

  saveAndShuffle() {
    // Get all part1 and part2 values from questions
    const part1Array = this.questions.map(q => q.part1);
    const part2Array = this.questions.map(q => q.part2);

    // Shuffle the arrays
    this.shuffledPart1 = this.shuffleArray(part1Array);
    this.shuffledPart2 = this.shuffleArray(part2Array);

    // Reset selected answers and submission status
    this.selectedAnswers = new Array(this.questions.length).fill(null);
    this.isSubmitted = false;
  }

  // Shuffle function
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Check answers
  submitAnswers() {
    this.correctCount = 0;
    this.incorrectCount = 0;

    // Compare selected answers to the correct answers
    this.selectedAnswers.forEach((answer, index) => {
      const correctAnswer = this.questions.find(q => q.part1 === this.shuffledPart1[index])?.part2;
      if (answer === correctAnswer) {
        this.correctCount++;
      } else {
        this.incorrectCount++;
      }
    });

    this.isSubmitted = true;
  }

  // End MAtching Functiions

  // Start True or false 
  checkStudentAnswer() {
    if (this.selectedAnswerId === this.correctAnswerId) {
      this.feedbackMessage = 'Correct!'; // Feedback for correct answer
    } else {
      this.feedbackMessage = 'Incorrect, try again!'; // Feedback for incorrect answer
    }
  }
  setCorrectAnswerTF(id: number) {
    this.correctAnswerId = id;
  }


  // Sortiing Group Funtions
  categories: Category[] = [];
  allItems: Item[] = [];
  mode: 'teacher' | 'student' = 'teacher'; // Start in Teacher mode
  newCategoryName = ''; // For entering new category name

  // Toggle between Teacher and Student Mode
  toggleMode() {
    if (this.mode === 'teacher') {
      this.allItems = this.categories.flatMap((category) => category.items);
      this.categories.forEach((category) => (category.items = [])); // Clear items from categories
      this.mode = 'student'; // Switch to student mode
    } else {
      this.mode = 'teacher'; // Switch back to teacher mode
    }
  }

  // Add a new category
  addCategory() {
    if (this.newCategoryName.trim()) {
      this.categories.push({
        name: this.newCategoryName.trim(),
        items: [],
        newItemText: '',
      });
      this.newCategoryName = ''; // Reset the category name input
    }
  }

  // Toggle edit mode for a category name
  toggleEditMode(category: Category) {
    category.editMode = !category.editMode;
  }

  // Add an item to a category
  addItemToCategory(category: Category) {
    if (category.newItemText?.trim()) {
      category.items.push({ text: category.newItemText.trim() });
      category.newItemText = ''; // Reset the input after adding the item
    }
  }

  // Drag-and-drop logic for moving items between the pool and categories
  drop(event: CdkDragDrop<Item[]>, category?: Category) {
    const item = event.item.data;
    const containerData = event.previousContainer.data as Item[];

    // If dropped into a category
    if (category) {
      if (!category.items.includes(item)) {
        category.items.push(item);  // Add the item to the dropped category
      }
    } else {
      // If dropped back into the pool
      if (!this.allItems.includes(item)) {
        this.allItems.push(item); // Add the item back to the pool
      }
    }

    // Remove the item from its previous container
    const itemIndex = containerData.indexOf(item);
    if (itemIndex !== -1) {
      containerData.splice(itemIndex, 1); // Remove item from its original position
    }
  }

  // Check answers in Student Mode
  checkAnswers() {
    let correctCount = 0;
    this.categories.forEach((category) => {
      const correctItems = category.items.filter((item) => {
        if (category.name === 'Land') {
          return ['Lion', 'Giraffe'].includes(item.text);
        } else if (category.name === 'Sea') {
          return ['Shark', 'Whale'].includes(item.text);
        }
        return false;
      });
      correctCount += correctItems.length;
    });
    alert(`You have ${correctCount} correct items.`);
  }
}

