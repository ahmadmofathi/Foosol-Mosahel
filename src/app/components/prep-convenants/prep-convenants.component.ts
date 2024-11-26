import { Component } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-prep-convenants',
  templateUrl: './prep-convenants.component.html',
  styleUrls: ['./prep-convenants.component.css']
})
export class PrepConvenantsComponent {

  public Editor = ClassicEditor;
  public editorData = '';
  
  public editorConfig = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'blockQuote', 'insertTable', '|', 'undo', 'redo'
    ],
    editor: {
      styles: {
        backgroundColor: '#E6E6E6',
        border: 'none'
      }
    }
  };

}
