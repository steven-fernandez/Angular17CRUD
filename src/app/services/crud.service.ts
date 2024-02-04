import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts`);
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/posts/${id}`, post);
  }
  

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }
  
}
