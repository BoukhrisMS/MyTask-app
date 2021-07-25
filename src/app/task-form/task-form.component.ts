import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter,tap,takeUntil} from 'rxjs//operators';
import { User } from '../authentication/user.model';
import { AuthService } from '../services/auth/auth.service';
import { TaskService } from '../task.service';

type FormAction='add'|'edit';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit , OnDestroy {

  action:FormAction;
  taskForm:FormGroup;
  destroy$=new Subject();
  taskId:string;
  
  constructor(private formBuilder:FormBuilder, private route:ActivatedRoute, private taskService:TaskService ,private authService:AuthService) { }
  
  ngOnInit(): void {
    
    
        this.route.paramMap.pipe(
        filter(p => !p.has('taskId')),
        tap(p => {
          this.action = p.get('action') as FormAction;
          this.initForm();
          console.log("ajout");
         }),
        takeUntil(this.destroy$),
      ).subscribe();

      
      
      this.route.paramMap.pipe(
        filter(p => p.has('taskId')),tap(p=> {
            this.action = p.get('action') as FormAction;
            this.taskId = p.get('taskId');
            this.getTaskByid(this.taskId);
            console.log("modif")
        }),takeUntil(this.destroy$),
      ).subscribe();
      
    
   
    }

    

    initForm(){
      const user=JSON.parse(localStorage.getItem('user'))
      this.taskForm=this.formBuilder.group({
        title: ['', Validators.required],
        description:'',
        state:false,
        user:user.email
      
      
    });
  }


  getTaskByid(taskId:string){
    this.taskService.getTaskById(taskId).subscribe(task =>{
      this.taskForm=this.formBuilder.group({
        title: [task.title, Validators.required],
        description:task.description,
        state:'',
              
      })
    })
  }

  get formControls(){
    return this.taskForm.controls;
  }

  onSaveTask(){
    
    
    let taskForm =this.taskForm.value;
    switch (this.action){
      case 'add':{

        this.taskService.addTask(taskForm);break;
      }
        case 'edit':{

          taskForm.id=this.taskId;
          this.taskService.updateTask(taskForm);break;
        }
      default: this.taskService.addTask(taskForm);
      console.log(this.action);
      break;
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
