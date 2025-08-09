import { Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-tabla',
  templateUrl: './modal-tabla.component.html',
  styleUrls: [],
  providers: [],
})
export class ModalTablaComponents {
  @Output() form: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<ModalTablaComponents>,
    private dialog: MatDialog
  ) {
  }

  submit() {
    if(this.form.valid){
      this.dialogRef.close(this.form);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar() {
    this.form.reset();
    this.dialog.closeAll();
  }
}
