import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post-service';
import { Post } from '../../../interfaces/post';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../landing/navbar/navbar.component/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule,NavbarComponent,FormsModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss'
})
export class PostDetail implements OnInit{
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  editedPost = {
    title:'',
    content:''
  }
  post: Post | null = null;
  loading = true;
  isEditing = false;
  canEdit = false;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.loadPost(id);
    }
  }
  private loadPost(id: string) {
    this.postService.getPostById(id).subscribe({
      next: (post: Post) => {
        this.post = post;
        this.loading = false;
        const currentUser = this.authService.authState.getValue().user;
        this.canEdit = (currentUser && post.authorId === currentUser._id ) as boolean
      },
      error: (error: any) => {
        this.error = 'Failed to load post';
        this.loading = false;
        console.error('Error loading post:', error);
      }
    })
  }
  startEdit() {
    if(this.post) {
      this.editedPost = {
        title: this.post.title,
        content: this.post.content
      };
      this.isEditing = true;
    }
  }
  confirmDelete() {
    if(confirm('Are you sure you want to delete this post?')) {
      this.deletePost();
    }
  }
  cancelEdit() {
    this.isEditing = false;
  }
  onSubmit() {
    this.postService.updatePost(this.post?._id as string,this.editedPost).subscribe({
      next: (updatedPost) => {
        this.post = updatedPost;
        this.isEditing = false;
        this.toastr.success('Post updated successfully', 'Success');
        this.router.navigate([`/posts`]);
      },
      error: (error) => {
        this.toastr.error('Failed to update post. Please try again.', 'Error');
        console.error('Error updating post:', error);
      }
    })
  }
  private deletePost() {
    if(!this.post)  return;
    const currentUser = this.authService.authState.getValue().user;
    if(!currentUser) {
      this.toastr.error('You must be logged in to delete a post', 'Error');
      return;
    }
    this.loading = true;
    this.postService.deletePost(this.post._id,currentUser._id).subscribe({
      next: () => {
        this.toastr.success('Post deleted successfully', 'Success');
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Failed to delete post. Please try again.', 'Error');
        console.error('Error deleting post:', error);
      }
    })
  }
}
