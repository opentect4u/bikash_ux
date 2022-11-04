/* eslint-disable @typescript-eslint/naming-convention */
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  providers: [DatePipe],
})
export class NotesPage implements OnInit {
  showBtn = true;
  openModal = false;
  noteList: any = [];
  noteForm: FormGroup;
  constructor(
    private dbIntr: DbInteractionService,
    private datePipe: DatePipe,
    private loader: LoaderService
  ) {
    this.addForm();
  }

  ngOnInit() {
    this.settourDiaryLists('', localStorage.getItem('user_id'));
  }
  addForm() {
    this.noteForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl(this.datePipe.transform(new Date(), 'YYYY-MM-dd'), [
        Validators.required,
      ]),
      notes: new FormControl('', [Validators.required]),
      id: new FormControl(0),
    });
  }
  modalChange(ev) {
    this.resetForm();
    this.openModal = ev;
    this.noteForm.patchValue({
      id: 0,
    });
  }
  addNotes() {
    // this.loader.showLoading('Saving data..');
    this.showSpinner();
    const dt = {
      user_id: localStorage.getItem('user_id'),
      user: localStorage.getItem('name'),
      diary_title: this.noteForm.value.title,
      diary_note: this.noteForm.value.notes,
      diary_date: this.noteForm.value.date,
      sl_no: this.noteForm.value.id,
      ardb_id: localStorage.getItem('ardb_id'),
    };
    this.dbIntr.callApi(1, 'tour_diary', dt).subscribe(
      (res: any) => {
        if (res.suc > 0) {
          setTimeout(() => {
            this.showSpinner();
            this.closeModal();
            if (this.noteForm.value.id > 0) {
              const findIndex = this.noteList.findIndex(
                (x: any) => x.sl_no === this.noteForm.value.id
              );
              this.noteList[findIndex] = {
                sl_no: this.noteForm.value.id,
                diary_note: this.noteForm.value.notes,
                diary_title: this.noteForm.value.title,
                diary_date: this.noteForm.value.date,
              };
            } else {
              this.settourDiaryLists('', localStorage.getItem('user_id'));
            }
            this.loader.presentToast(
              this.noteForm.value.id > 0
                ? 'Tour diary updated successfully'
                : 'Tour diary added successfully',
              'S'
            );
            this.resetForm();
          }, 3000);
        } else {
          this.showSpinner();
          this.loader.presentToast('Tour diary submission failed', 'E');
        }
      },
      (err) => {
        this.showSpinner();
        this.loader.presentToast(
          'server not responding! please try again later',
          'E'
        );
      }
    );
  }
  closeModal() {
    this.openModal = !this.openModal;
  }
  openModalForEdit(ev) {
    this.setForm(ev.diary_date, ev.diary_title, ev.diary_note, ev.sl_no);
    this.openModal = !this.openModal;
  }
  setForm(_date, _title, _notes, _id) {
    this.noteForm.patchValue({
      title: _title,
      notes: _notes,
      date: this.datePipe.transform(_date, 'YYYY-MM-dd'),
      id: _id,
    });
  }
  resetForm() {
    this.noteForm.reset();
    this.noteForm.patchValue({
      date: this.datePipe.transform(new Date(), 'YYYY-MM-dd'),
    });
  }
  showSpinner() {
    this.showBtn = !this.showBtn;
  }
  settourDiaryLists(id, userId) {
    this.dbIntr
      .callApi(0, 'tour_diary', 'id=' + id + '&user_id=' + userId + '&max=6')
      .pipe(map((x: any) => x.msg))
      .subscribe((res) => {
        this.noteList = res;
      });
  }
}
