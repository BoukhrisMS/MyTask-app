import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthGuard } from './guard/auth.guard';
import { TaskFormComponent } from './task-form/task-form.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {path:'', redirectTo:'tasks', pathMatch:'full'},
  {path:'signin',component:SigninComponent},
  {path:'signup',component:SignupComponent},
  {path:'user-profile',canActivate:[AuthGuard], loadChildren:()=> import('../app/user-profile.module').then(mod => mod.UserProfileModule)},
  {path:'tasks',canActivate:[AuthGuard],component:TasksComponent},
  {path:':action',canActivate:[AuthGuard], component:TaskFormComponent},
  {path:':action/:taskId',canActivate:[AuthGuard], component:TaskFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
