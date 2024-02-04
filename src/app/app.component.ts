import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CrudService } from './services/crud.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class AppComponent implements OnInit, OnDestroy {

  posts: any[] = [];
  isModalOpen = false;
  currentPost: any = {};
  private subscriptions = new Subscription(); // Subscription object to track all subscriptions

  constructor(private crudService: CrudService) { }
  
  ngOnInit(): void {
    this.loadPosts();      
  }

  loadPosts(): void {
    const subscription = this.crudService.getPosts().subscribe((data) => {
      this.posts = data;
    });
    this.subscriptions.add(subscription);
  }

  deletePost(id: number): void {
    const subscription = this.crudService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
    this.subscriptions.add(subscription);
  }

  openEditModal(post: any): void {
    this.currentPost = { ...post };
    this.isModalOpen = true;
  }

  openAddModal(): void {
    this.currentPost = {};
    this.isModalOpen = true;
  }

  savePost(): void {
    let subscription;
    if (this.currentPost.id) {
      // Update existing post
      subscription = this.crudService.updatePost(this.currentPost.id, this.currentPost).subscribe({
        next: (updatedPost) => {
          const index = this.posts.findIndex(post => post.id === this.currentPost.id);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating post:', error);
        }
      });
    } else {
      // Add new post
      subscription = this.crudService.createPost(this.currentPost).subscribe({
        next: (newPost) => {
          this.posts.push(newPost);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error adding post:', error);
        }
      });
    }
    this.subscriptions.add(subscription);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentPost = {};
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }
  
}
