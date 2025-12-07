/*
 * Copyright (c) 2025 Ing. Sascha Ernst Pucher.
 *
 * This file (expense.component.ts) is part of expense-tracker.
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

import {Component, OnInit} from '@angular/core';
import {ExpenseService} from '../service/expense.service';
import {Expense} from '../model/expense.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ExpenseDialogComponent} from './dialog/expense-dialog.component';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatChip} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatButton,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatChip,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatIconButton,
    MatRow,
    // Material Module Imports hier oder im Standalone-Bootstrapping
  ]
})
export class ExpenseComponent implements OnInit {

  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Expense>([]);
  selectedCategory = '';
  totalAmount = 0;

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loadexpense();
  }

  loadexpense(): void {
    this.expenseService.getAll().subscribe(expense => {
      this.dataSource.data = expense;
      this.calculateTotal();
    });
  }

  applyFilter(): void {
    if (this.selectedCategory) {
      this.dataSource.filterPredicate = (data: Expense, filter: string) =>
        data.category.trim().toLowerCase() === filter.trim().toLowerCase();
      this.dataSource.filter = this.selectedCategory;
    } else {
      this.dataSource.filter = '';
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.dataSource.filteredData
      .reduce((sum, e) => sum + e.amount, 0);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '500px',
      data: {expense: null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.create(result).subscribe(() => {
          this.loadexpense();
          this.snackBar.open('Ausgabe hinzugefügt', 'OK', {duration: 3000});
        });
      }
    });
  }

  openEditDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '500px',
      data: {expense: {...expense}}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.update(expense.id!, result).subscribe(() => {
          this.loadexpense();
          this.snackBar.open('Ausgabe aktualisiert', 'OK', {duration: 3000});
        });
      }
    });
  }

  delete(expense: Expense): void {
    if (confirm(`"${expense.description}" wirklich löschen?`)) {
      this.expenseService.delete(expense.id!).subscribe(() => {
        this.loadexpense();
        this.snackBar.open('Ausgabe gelöscht', 'OK', {duration: 3000});
      });
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Lebensmittel': 'primary',
      'Transport': 'accent',
      'Freizeit': 'warn',
      'Rechnungen': 'primary',
      'Sonstiges': ''
    };
    return colors[category] || '';
  }
}

