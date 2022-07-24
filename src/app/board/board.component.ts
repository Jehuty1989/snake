import { Component, OnInit, ViewChild } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  enterPressed: boolean = false;
  canvas: any;
  ctx: any;
  head: any = { x: 200, y: 190 };
  body: any[] = [];
  previousSegment: any;
  food: any = { x: 0, y: 0 };
  speed: number = 100;
  score: number = 0;
  direction: any = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }
  enteredDirection: any = '';
  bufferedDirection: string = '';

  constructor() { }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(200, 190, 10, 10);

    this.drawFood()

    document.addEventListener('keydown', (event) => {
      const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

      if (event.key === 'Enter' && !this.enterPressed) {
        this.enterPressed = true;
        this.direction.ArrowLeft = true;
        this.runGame();
        return;
      }

      if (arrows.includes(event.key) && !!!this.bufferedDirection) {
        this.enteredDirection = arrows.find(x => x === event.key);
        this.bufferedDirection = this.enteredDirection;
        if (
          this.direction.ArrowLeft && this.bufferedDirection === 'ArrowRight' ||
          this.direction.ArrowRight && this.bufferedDirection === 'ArrowLeft' ||
          this.direction.ArrowUp && this.bufferedDirection === 'ArrowDown' ||
          this.direction.ArrowDown && this.bufferedDirection === 'ArrowUp'
          ) {
            return;
          }
          for (const key in this.direction) {
            this.direction[key] = false;
          }
          this.direction[this.enteredDirection] = true;
        }
    })
  }

  runGame() {
    setTimeout(() => {
      this.moveHead();

      if (
        this.head.x === -10 ||
        this.head.x === 400 ||
        this.head.y === -10 ||
        this.head.y === 400
      ) {
        return;
      }

      for (const segment of this.body) {
        if (this.head.x === segment.x && this.head.y === segment.y) {
          return;
        }
      }

      this.redrawGame()

      this.runGame();
    }, this.speed);
  }

  redrawGame() {
    if (this.head.x === this.food.x && this.head.y === this.food.y) {
      this.score += 10;
      if (this.score % 50 === 0) {
        this.speed -= 10;
      }
      this.drawFood();
      this.addSegment();
    }
    this.bufferedDirection = '';
    this.ctx.fillStyle = 'black';
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.fillRect(this.head.x, this.head.y, 10, 10);
    for (const segment of this.body) {
      this.ctx.fillRect(segment.x, segment.y, 10, 10);
    }
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(this.food.x, this.food.y, 10, 10);
  }

  drawFood() {
    const foodX = Math.floor(Math.random() * 40) * 10;
    const foodY = Math.floor(Math.random() * 40) * 10;

    if (foodX === this.head.x && foodY === this.head.y) {
      this.drawFood();
      return;
    }

    for (const segment of this.body) {
      if (foodX === segment.x && foodY === segment.y) {
        this.drawFood();
        return;
      }
    }

    this.food.x = foodX;
    this.food.y = foodY;

    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(foodX, foodY, 10, 10);
  }

  moveHead() {
    this.previousSegment = JSON.parse(JSON.stringify(this.head));
    if (this.direction.ArrowUp) {
      this.head.y -= 10;
    } else if (this.direction.ArrowDown) {
      this.head.y += 10;
    } else if (this.direction.ArrowLeft) {
      this.head.x -= 10;
    } else if (this.direction.ArrowRight) {
      this.head.x += 10;
    }

    this.moveSegments();
  }

  moveSegments() {
    this.body = this.body.reduce((accum: any, cur: any) => {
      accum.push({ x: this.previousSegment.x, y: this.previousSegment.y })
      this.previousSegment = cur;
      return accum;
    }, [])
  }

  addSegment() {
    this.body.push({});
  }
}
