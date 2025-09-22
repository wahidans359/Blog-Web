import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly baseUrl = 'http://localhost:3000/posts/';
  private readonly postPerPage = 9;

  constructor(private http: HttpClient) {}
  private handleError(error: HttpErrorResponse) {
    if(error.status === 400) {
      return throwError(() => 'Invalid ID format');
    }
    if(error.status === 403) {
      return throwError(() => 'You are not authorized to perform this action');
    }
    if(error.status === 404) {
      return throwError(() => 'Post not found');
    }
    if(error.status === 500) {
      return throwError(() => 'A server error occurred. Please try again later.');
    }
    return throwError(()=> 'An error occured. Please try again later.')
  } 
  getPosts() : Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }
  createPost(postData: {title: string, content: string}, userId: string) : Observable<Post> {
    console.log('Creating post with data:', postData, 'for userId:', userId);
    return this.http.post<Post>(this.baseUrl, postData).pipe(
      catchError(this.handleError)
    );
  }
  getPostById(id: string) : Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }
  updatePost(postId:string, updates:{title?:string; content?:string}) : Observable<Post> {
    return this.http.patch<Post>(`${this.baseUrl}${postId}`, updates).pipe(
      catchError(this.handleError)
    );
  }
  isAuthor(post:Post, userId:string) : boolean {
    return post.authorId === userId;
  }
  deletePost(postId:string,userId:string) : Observable<void> {
    return this.http.delete<void> (`${this.baseUrl}${postId}`).pipe(
      catchError(this.handleError)
    );
  }
}

