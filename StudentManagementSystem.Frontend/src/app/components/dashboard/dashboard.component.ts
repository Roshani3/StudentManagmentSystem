import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  currentUser: { username: string; role: string } | null = null;

  get totalStudents() { return this.students.length; }
  get uniqueCourses() { return new Set(this.students.map(s => s.course)).size; }
  get avgAge() {
    if (!this.students.length) return 0;
    return Math.round(this.students.reduce((a, s) => a + s.age, 0) / this.students.length);
  }
  get recentlyAdded() {
    const now = new Date();
    return this.students.filter(s => {
      const d = new Date(s.createdDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }
  get recentStudents() {
    return [...this.students].sort((a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    ).slice(0, 5);
  }
  get courseBreakdown() {
    const map: Record<string, number> = {};
    this.students.forEach(s => { map[s.course] = (map[s.course] || 0) + 1; });
    return Object.entries(map)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  constructor(private studentService: StudentService, private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.studentService.getAll().subscribe({
      next: res => { this.students = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}