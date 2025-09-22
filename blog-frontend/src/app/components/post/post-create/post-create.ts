import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post-service';
import { AuthService } from '../../../services/auth-service';
import { NavbarComponent } from '../../landing/navbar/navbar.component/navbar.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent],
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss'
})
export class PostCreate implements OnInit{
  @ViewChild('postForm') postForm! : NgForm;
  private router = inject(Router);
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  formData = {
    title: '',
    content: ''
  };

  isSubmitting = false;
  error: string | null = null;
  // authState$ = this.authService.authState$;
  // authState$ = this.authService.authState$;
  ngOnInit(): void {
      const authState = this.authService.authState.getValue();
      console.log('Auth state on init:', authState);
      if(!authState.isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }
  }
  onSubmit() {
    if(this.postForm.invalid) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.isSubmitting = true;
    console.log('state : ', this.authService.authState.getValue());
    const userData = this.authService.authState.getValue().user;
    console.log('User data from auth state:', userData);
    const isAuthenticated = this.authService.authState.getValue().isAuthenticated;
    console.log('Submitting post:', this.formData, 'isAuthenticated:', isAuthenticated);

    if(!isAuthenticated) {
      this.error = 'User not authenticated.';
      this.isSubmitting = false;
      this.router.navigate(['/login']);
      return;
    }
    this.postService.createPost(this.formData,'userId').subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastrService.success('Post created successfully', 'Success');
        this.router.navigate(['/posts']);
      },
      error : (error : any) => {
        this.isSubmitting = false;
        this.toastrService.error('Failed to create post. Please try again.', 'Error');
        this.error = error?.error?.message || 'Failed to create post. Please try again.';
      }
    })


  }
}
