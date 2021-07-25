import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from './task.model';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../authentication/user.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks:Task[];
  //currentUser=JSON.parse(localStorage.getItem('user'));
  
  constructor(private taskService:TaskService, private authservice:AuthService) {
    
   }

  ngOnInit(): void {
    this.taskService.getTasks().pipe(
      tap(tasks =>{
        this.tasks=tasks;
        
      })
    ).subscribe();

  }
    deleteTask(taskId){
      this.taskService.deleteTask(taskId);

  }

  completeTask(taskId){
    this.taskService.completeTask(taskId);
  }


}
