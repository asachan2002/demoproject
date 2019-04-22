import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PathService } from '../path.service';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  targetNodes: Array<string> = ['A'];
  destinationNodes: Array<any> = [];
  destinationDistance: Array<any> = [];
  shortestPaths: Array<Object> = [];
  subscription: Subscription;
  /**
   * To get a reference of PathService.
   */
  constructor(private pathService: PathService) {

  }
  /**
  * get response and segregate data from response to populate local array.
  */
  ngOnInit() {
    this.subscription = this.pathService.getResponse().subscribe(
      response => {
        let resData = (response as any).data;
        let destNode: Array<string> = [];
        let distance: Array<any> = [];
        this.destinationNodes.push(destNode);
        this.destinationDistance.push(distance);
        for (let i = 0; i < resData.length; i++) {
          if (this.targetNodes.indexOf(resData[i].planetDestination) === -1) {
            this.targetNodes.push(resData[i].planetDestination);
            let destNode: Array<string> = [];
            let distance: Array<number> = [];
            this.destinationNodes.push(destNode);
            this.destinationDistance.push(distance);
          }
          this.destinationNodes[this.targetNodes.indexOf(resData[i].planetOrigin)].push(resData[i].planetDestination);
          this.destinationDistance[this.targetNodes.indexOf(resData[i].planetOrigin)].push(resData[i].distanceLightYears);
        }

      },
      error => {
        console.log(error);
      })
  }
  /**
  * receive submit event and get target nodes to find out the shortest path form that that target node. 
  */
  getShortestPath(f: NgForm) {
    let SelectectNode = "B";
    let selectedNodeIndex = -1;
    let routingPath = "";
    if (!f.untouched) {
      SelectectNode = f.value.selectedOption;
    }
    let matrix: any = this.drawAdjancyMatrix();
    this.pathService.algorithm(matrix, matrix.length, 0);
    let shortestPath = (this.pathService.shortestPath).split("#");
    selectedNodeIndex = this.targetNodes.indexOf(SelectectNode);
    let traversingNode = shortestPath[selectedNodeIndex + 1].split("*");
    for (let i = 1; i < traversingNode.length; i++) {
      routingPath += "=>" + this.targetNodes[traversingNode[i]] + " ";
    }
    let routingNode = { sourcenode: "A", destinationnode: this.targetNodes[selectedNodeIndex], routingnode: "A " + routingPath, distance: this.pathService.shortestDistance[selectedNodeIndex] };
    this.shortestPaths.push(routingNode);
  }
  /**
  * create and initialize double dimensional array.
  */
  initializeTwoDArray(n: number): any {
    let matrix = [];
    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  }
  /**
  * Create function to initialize adjancymatix as per response data. it is used to calculate shortest path.
  */
  drawAdjancyMatrix(): any {
    let adjancyMatrix = this.initializeTwoDArray(this.targetNodes.length);
    for (let i = 0; i < this.targetNodes.length; i++) {
      for (let j = 0; j < this.destinationNodes[i].length; j++) {
        adjancyMatrix[i][this.targetNodes.indexOf(this.destinationNodes[i][j])] = this.destinationDistance[i][j];
      }
    }
    return adjancyMatrix;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
