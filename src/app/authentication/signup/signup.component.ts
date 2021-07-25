import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm:FormGroup;


  constructor(private formBuilder: FormBuilder,private router : Router , private authservice : AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signUpForm=this.formBuilder.group({
      userName:['' , Validators.required],
      email : ['',[Validators.email, Validators.required]],
      password :['' , [Validators.required , Validators.pattern('[0-9a-zA-Z]{6,}')]]
    });
  }

  get formControls(){
    return this.signUpForm.controls;
  }
  onSubmit(){
    this.authservice.createNewUser(this.signUpForm.value).then(()=> this.router.navigate(['/signin']))
  }

}
