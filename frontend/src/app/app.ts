
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService, Task } from './services/task';
import { WeatherService, Weather } from './services/weather';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly weatherService = inject(WeatherService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly todoTasks = computed(() =>
    this.tasks().filter(task => !task.completed)
  );

  readonly completedTasks = computed(() =>
    this.tasks().filter(task => task.completed)
  );

  readonly pendingCount = computed(() => this.todoTasks().length);
  readonly completedCount = computed(() => this.completedTasks().length);

  title = '';
  description = '';
  readonly today = new Date();

  readonly weather = signal<Weather | null>(null);
  readonly weatherLoading = signal(false);
  readonly weatherError = signal('');
  weatherCity = 'Johannesburg';

  ngOnInit(): void {
    this.loadTasks();
    this.loadWeather();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set('');

    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load tasks. Please try again.');
        this.loading.set(false);
      }
    });
  }

  addTask(): void {
    const taskTitle = this.title.trim();

    if (!taskTitle || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.taskService.createTask({
      title: taskTitle,
      description: this.description.trim()
    }).subscribe({
      next: task => {
        this.tasks.update(tasks => [task, ...tasks]);
        this.title = '';
        this.description = '';
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Unable to create task. Please try again.');
        this.saving.set(false);
      }
    });
  }

  completeTask(task: Task): void {
    if (task.completed) return;

    this.error.set('');

    this.taskService.completeTask(task.id).subscribe({
      next: updatedTask => {
        this.tasks.update(tasks =>
          tasks.map(item =>
            item.id === updatedTask.id ? updatedTask : item
          )
        );
      },
      error: () => {
        this.error.set('Unable to complete task. Please try again.');
      }
    });
  }

  deleteTask(task: Task): void {
    this.error.set('');

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update(tasks =>
          tasks.filter(item => item.id !== task.id)
        );
      },
      error: () => {
        this.error.set('Unable to delete task. Please try again.');
      }
    });
  }

  loadWeather(city = this.weatherCity): void {
    this.weatherLoading.set(true);
    this.weatherError.set('');

    this.weatherService.getWeather(city).subscribe({
      next: data => {
        this.weather.set(data);
        this.weatherLoading.set(false);
      },
      error: () => {
        this.weatherError.set(
          'Unable to load weather information. Please try again.'
        );
        this.weatherLoading.set(false);
      }
    });
  }

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.loadWeather('Johannesburg');
      return;
    }

    this.weatherLoading.set(true);
    this.weatherError.set('');

    navigator.geolocation.getCurrentPosition(
      position => {
        const coordinates =
          `${position.coords.latitude},${position.coords.longitude}`;
        this.loadWeather(coordinates);
      },
      () => this.loadWeather('Johannesburg'),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }

  weatherIconUrl(icon: string): string {
    if (!icon) return '';
    return icon.startsWith('//') ? `https:${icon}` : icon;
  }
}
