import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PathService {
  apiHost = 'assets/routes/routes.json';
  shortestDistance = [];
  shortestPath: string;
  /**
  * To get a reference of HttpClient.
  */
  constructor(private httpClient: HttpClient) {
  }
  /**
  * To get a response from then server.
  */
  getResponse() {
    return this.httpClient.get(this.apiHost);
  }
 /**
  * logic to get shortest path using shotest path alogrithm.
  */
  algorithm(graph: Array<number>, noOfNodes: number, startNode: number) {
    let dist: Array<number> = [];
    let sptSet: Array<boolean> = [];
    let parent: Array<number> = [];
    for (let i = 0; i < noOfNodes; i++) {
      parent[0] = -1;
      dist[i] = Number.MAX_VALUE;
      sptSet[i] = false;
    }
    dist[startNode] = 0;
    for (let count = 0; count < noOfNodes - 1; count++) {
      let mindis = this.minDistance(dist, sptSet, noOfNodes);
      sptSet[mindis] = true;
      for (let node = 0; node < noOfNodes; node++) {
        if (!sptSet[node] && graph[mindis][node] && dist[mindis] + graph[mindis][node] < dist[node]) {
          parent[node] = mindis;
          dist[node] = dist[mindis] + graph[mindis][node];
          this.shortestDistance[node] = dist[node];
        }
      }
    }
    for (let j = 0; j < noOfNodes; j++) {
      this.setPath(parent, j);
    }   

  }
  
  minDistance(dist: Array<number>, sptSet: Array<boolean>, numOfNodes: number): number {
    let min = Number.MAX_VALUE, min_index = -1;
    for (let i = 0; i < numOfNodes; i++) {
      if (sptSet[i] === false && dist[i] <= min) {
        min = dist[i], min_index = i;
      }
    }
    return min_index;
  }
 /**
  * create to set shortest path for each target nodes. 
  */
  setPath(parent: Array<number>, j: number) {
    if (parent[j] == - 1) {
      this.shortestPath = this.shortestPath + "#";
      return;
    }
    this.setPath(parent, parent[j]);
    this.shortestPath = this.shortestPath + "*" + j;
  }


}
