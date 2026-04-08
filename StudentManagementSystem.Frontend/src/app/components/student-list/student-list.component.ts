import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  courses: string[] = [];
  loading = true;
  searchTerm = '';
  filterCourse = '';

  showFormModal = false;
  showDeleteModal = false;
  editingStudent: Student | null = null;
  deletingStudent: Student | null = null;

  formData: CreateStudentDto = { name: '', email: '', age: 18, course: '' };
  formSubmitted = false;
  formLoading = false;
  formError = '';

  successMsg = '';
  errorMsg = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() { this.loadStudents(); }

  loadStudents() {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: res => {
        this.students = res.data || [];
        this.courses = [...new Set(this.students.map(s => s.course))].sort();
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Failed to load students'; this.loading = false; }
    });
  }


  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(s =>
      (!term || s.name.toLowerCase().includes(term) ||
       s.email.toLowerCase().includes(term) ||
       s.course.toLowerCase().includes(term)) &&
      (!this.filterCourse || s.course === this.filterCourse)
    );
  }

  openAddModal() {
    this.editingStudent = null;
    this.formData = { name: '', email: '', age: 18, course: '' };
    this.formSubmitted = false;
    this.formError = '';
    this.showFormModal = true;
  }

  openEditModal(s: Student) {
    this.editingStudent = s;
    this.formData = { name: s.name, email: s.email, age: s.age, course: s.course };
    this.formSubmitted = false;
    this.formError = '';
    this.showFormModal = true;
  }

  openDeleteModal(s: Student) {
    this.deletingStudent = s;
    this.showDeleteModal = true;
  }

  closeFormModal() {
    if (!this.formLoading) this.showFormModal = false;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isFormValid(): boolean {
    return !!(this.formData.name && this.isValidEmail(this.formData.email) &&
      this.formData.age >= 1 && this.formData.age <= 120 && this.formData.course);
  }

  onFormSubmit() {
    this.formSubmitted = true;
    if (!this.isFormValid()) return;
    this.formLoading = true;
    this.formError = '';

    const call = this.editingStudent
      ? this.studentService.update(this.editingStudent.id, this.formData as UpdateStudentDto)
      : this.studentService.create(this.formData);

    call.subscribe({
      next: res => {
        this.formLoading = false;
        if (res.success) {
          this.showFormModal = false;
          this.showSuccess(this.editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
          this.loadStudents();
        } else {
          this.formError = res.message;
        }
      },
      error: err => {
        this.formLoading = false;
        this.formError = err.error?.message || 'Something went wrong';
      }
    });
  }

  onDelete() {
    if (!this.deletingStudent) return;
    this.formLoading = true;
    this.studentService.delete(this.deletingStudent.id).subscribe({
      next: res => {
        this.formLoading = false;
        if (res.success) {
          this.showDeleteModal = false;
          this.showSuccess('Student deleted successfully!');
          this.loadStudents();
        }
      },
      error: err => {
        this.formLoading = false;
        this.errorMsg = err.error?.message || 'Failed to delete student';
        this.showDeleteModal = false;
      }
    });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => this.successMsg = '', 4000);
  }
}
