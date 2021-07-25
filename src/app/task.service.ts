import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from './tasks/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  
  Tasks:Observable<Task[]>;
  tasksCollection:AngularFirestoreCollection<Task>;
  taskDocument: AngularFirestoreDocument;
  
  
  constructor(private afs:AngularFirestore, private router:Router) { }

addTask(task:Task){
  return new Promise<any>((resolve,reject)=>{
    this.afs.collection('Tasks').add(task).then(res=>{
      this.router.navigate(['/tasks']);
    }, err=>{reject(err);
    window.alert(err.message)
  });
  });
}

getTasks():Observable<Task[]>{
  this.tasksCollection=this.afs.collection('Tasks', a => a.where('user', '==', (JSON.parse(localStorage.getItem('user'))).email));
  
  return this.Tasks=this.tasksCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data: Task=a.payload.doc.data() as Task;
        const id:string=a.payload.doc.id;
        data.id=id;
        return(data)
      });
      
    })
  );
}


getTaskById(taskId:string):Observable<any>{
  const taskPath=`Tasks/${taskId}`;
  this.taskDocument=this.afs.doc(taskPath);
  return this.taskDocument.valueChanges();
}


updateTask(taskForm){
  return new Promise<any>((resolve,reject)=>{
    this.afs.collection('Tasks').doc(taskForm.id).update(taskForm).then(res =>{
      this.router.navigate(['tasks']);
    },err=>{
      reject(err);
      window.alert(err.message);
    });
  });
}

deleteTask(taskId:string){
  const taskPath = `Tasks/${taskId}`;
  this.taskDocument=this.afs.doc(taskPath);
  return this.taskDocument.delete();
}

completeTask(taskId:string){
  this.afs.collection('Tasks').doc(taskId).update({state:true})
}

}


