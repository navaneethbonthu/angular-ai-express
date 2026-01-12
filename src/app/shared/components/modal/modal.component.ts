import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <dialog #dialog (click)="onBackdropClick($event)" class="modal-dialog">
      <div class="modal-content">
        <header class="modal-header">
          <ng-content select="[header]"></ng-content>
          <button type="button" (click)="close()" class="close-btn" aria-label="Close modal">
            ×
          </button>
        </header>
        <main class="modal-body">
          <ng-content></ng-content>
        </main>
      </div>
    </dialog>
  `,
  styles: `
    .modal-dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      height: 100%
      
      
    }
    dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    }
    .modal-content {
      padding: 0;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid #eee;

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
        padding: 0.5rem;
        color: #666;
        &:hover { color: #000; }
      }
    }

    .modal-body {
      padding: 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
    }
  `,
})
export class ModalComponent {
  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open() {
    this.dialog().nativeElement.showModal();
  }

  close() {
    this.dialog().nativeElement.close();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
