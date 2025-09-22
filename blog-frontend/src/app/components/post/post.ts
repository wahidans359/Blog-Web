import { Component, HostListener, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Post as Posts} from '../../interfaces/post';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../landing/navbar/navbar.component/navbar.component';
import { AuthService } from '../../services/auth-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post',
  imports: [CommonModule,RouterModule,NavbarComponent],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post implements OnInit{
  posts: Posts[] = [];
  loading = false;
  error: string | null = null;
  displayedPosts: Posts[] = [];
  currentIndex = 0;
  private destroy$ = new Subject<void>();


  authService = inject(AuthService);
  authState$ = this.authService.authState$;
  readonly postsPerBatch = 9;

  constructor (private postService: PostService) {}
  
  ngOnInit() {
    this.loadInitialPosts();
  }
  private loadInitialPosts() {
    if(this.loading || this.posts.length > 0) {
      return; // Prevent multiple initial loads
    }
    this.loading = true;
    this.postService.getPosts();
    this.postService.getPosts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadMorePosts();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load posts. Please try again later.';
        this.loading = false;
        console.error('Error fetching posts:', error);
      }
    })
  }
  @HostListener('window:scroll')
  onScroll() {
    if (this.isNearBottom() && !this.loading) {
      this.loadMorePosts();
    }
  }

  private isNearBottom(): boolean {
    const threshold = 150;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;
    return position > height - threshold;
  }

  private loadMorePosts() :void {
    if(this.currentIndex >= this.posts.length) {
      return; // No more posts to load
    }
    
    const nextBatch = this.posts.slice(
      this.currentIndex,
      this.currentIndex + this.postsPerBatch
    );
    this.displayedPosts = [...this.displayedPosts, ...nextBatch];
    this.currentIndex += this.postsPerBatch;
  }
  get hasMore(): boolean {
    return this.currentIndex < this.posts.length;
  }
}
