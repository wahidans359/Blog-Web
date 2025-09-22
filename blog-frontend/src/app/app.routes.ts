import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { Landing } from './components/landing/landing';
import { Post } from './components/post/post';
import { PostCreate } from './components/post/post-create/post-create';
import { authGuard, protectGuard } from './guards/auth-guard';
import { PostDetail } from './components/post/post-detail/post-detail';
export const routes: Routes = [
    {path:'',component:Landing},
    {path : 'auth', component : Auth,canActivate:[authGuard]},
    {path : 'login', component : Auth,canActivate:[authGuard]},
    {path : 'signup', component : Auth,canActivate:[authGuard]},
    {path: 'posts', component: Post},
    {path:'posts/create', component: PostCreate, canActivate:[protectGuard]},
    {path: 'posts/:id', component: PostDetail},
];
