/*
 * Copyright (c) 2025 Ing. Sascha Ernst Pucher.
 *
 * This file (expense-dialog.component.ts) is part of expense-tracker.
 *
 * expense-tracker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * expense-tracker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with expense-tracker.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Expense} from '../../model/expense.model';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-expense-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.expense ? 'Ausgabe bearbeiten' : 'Neue Ausgabe' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Beschreibung</mat-label>
          <input matInput formControlName="description" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Betrag (€)</mat-label>
          <input matInput type="number" step="0.01" formControlName="amount" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Datum</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Kategorie</mat-label>
          <mat-select formControlName="category" required>
            <mat-option value="Lebensmittel">Lebensmittel</mat-option>
            <mat-option value="Transport">Transport</mat-option>
            <mat-option value="Freizeit">Freizeit</mat-option>
            <mat-option value="Rechnungen">Rechnungen</mat-option>
            <mat-option value="Sonstiges">Sonstiges</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Abbrechen</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid"
              (click)="onSave()">Speichern
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatDialogTitle,
    MatInput,
    MatDatepickerInput,
    MatDialogActions,
    MatButton,
    /* alle Material + ReactiveFormsModule Imports */]
})
export class ExpenseDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { expense: Expense | null }
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      description: [this.data.expense?.description || '', Validators.required],
      amount: [this.data.expense?.amount || null, [Validators.required, Validators.min(0.01)]],
      date: [this.data.expense?.date ? new Date(this.data.expense.date) : new Date(), Validators.required],
      category: [this.data.expense?.category || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const value = this.form.value;
      const expense: Expense = {
        id: this.data.expense?.id,
        description: value.description!,
        amount: Number(value.amount!),
        date: value.date!.toISOString().split('T')[0],
        category: value.category!
      };
      this.dialogRef.close(expense);
    }
  }
}