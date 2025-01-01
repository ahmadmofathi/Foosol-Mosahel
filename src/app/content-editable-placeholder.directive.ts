import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appContentEditablePlaceholder]'
})
export class ContentEditablePlaceholderDirective {

  @Input() placeholder: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setPlaceholder();
  }

  private setPlaceholder() {
    if (!this.el.nativeElement.textContent.trim()) {
      this.el.nativeElement.textContent = this.placeholder;
      this.renderer.setStyle(this.el.nativeElement, 'color', '#ffff');
    }
  }

  @HostListener('focus')
  onFocus() {
    if (this.el.nativeElement.textContent === this.placeholder) {
      this.el.nativeElement.textContent = '';
      this.renderer.setStyle(this.el.nativeElement, 'color', '#ffff');
    }
  }

  @HostListener('blur')
  onBlur() {
    if (!this.el.nativeElement.textContent.trim()) {
      this.setPlaceholder();
    }
  }

}
