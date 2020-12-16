class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private virtualHeight: number;
  private virtualWidth: number;
  private virtualPixelSize: number;
  private globalXOffset : number;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');

    if (context) {
      this.context = context;
    } else {
      throw new Error('Canvas could not be found!');
    }

    this.virtualHeight = 40;
    this.virtualWidth = 75;
    this.virtualPixelSize = 20;
    this.globalXOffset = 15;

    this.canvas.width = this.virtualWidth * this.virtualPixelSize + this.virtualWidth + 1 + 20 + this.globalXOffset;
    this.canvas.height = this.virtualHeight * this.virtualPixelSize + this.virtualHeight + 1 + 20;
  }

  drawGrid() {
    this.context.lineWidth = 1;

    this.context.strokeStyle = 'lightgrey';
    this.context.font = '10px Arial';
    this.context.fillStyle = 'lightgrey';
    this.context.textAlign = 'center';

    for (let x = 0; x < this.virtualWidth; x++) {
      const realX = x * this.virtualPixelSize + x + this.globalXOffset;
      const realMaxY = this.virtualHeight * this.virtualPixelSize + this.virtualHeight;

      this.context.beginPath();
      this.context.moveTo(realX, 0);
      this.context.lineTo(realX, realMaxY);
      this.context.stroke();
      
      this.context.fillText(`${x}`, realX + (this.virtualPixelSize / 2), realMaxY + 11);
    }

    this.context.beginPath();
    this.context.moveTo(this.virtualWidth * this.virtualPixelSize + this.virtualWidth + this.globalXOffset, 0);
    this.context.lineTo(this.virtualWidth * this.virtualPixelSize + this.virtualWidth + this.globalXOffset, this.virtualHeight * this.virtualPixelSize + this.virtualHeight);
    this.context.stroke();


    this.context.textAlign = 'left';
    for (let y = 0; y < this.virtualHeight; y++) {
      const realY = y * this.virtualPixelSize + y;
      const realMaX = this.virtualWidth * this.virtualPixelSize + this.virtualWidth + this.globalXOffset;

      this.context.beginPath();
      this.context.moveTo(this.globalXOffset, realY);
      this.context.lineTo(realMaX, realY);
      this.context.stroke();

      this.context.fillText(`${this.virtualHeight - y - 1}`, 0,realY + (this.virtualPixelSize / 2)+5);
    }

    this.context.beginPath();
    this.context.moveTo(this.globalXOffset, this.virtualHeight * this.virtualPixelSize + this.virtualHeight);
    this.context.lineTo(this.virtualWidth * this.virtualPixelSize + this.virtualWidth + this.globalXOffset, this.virtualHeight * this.virtualPixelSize + this.virtualHeight);
    this.context.stroke();
  }

  private virtualVector2DToRealVector2D(value : Vector2D): Vector2D
  {
    const realVirtualX = value[0];
    const realVirtualY = this.virtualHeight - value[1];
    const realX = this.globalXOffset + this.virtualPixelSize * realVirtualX + realVirtualX + (this.virtualPixelSize / 2);
    const realY = this.virtualPixelSize * realVirtualY + realVirtualY - (this.virtualPixelSize / 2);

    return new Vector2D([realX, realY]);
  }

  drawLine(a : Vector2D, b : Vector2D, lineWidth = 2, color = 'black')
  {
    const realA = this.virtualVector2DToRealVector2D(a);
    const realB = this.virtualVector2DToRealVector2D(b);

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = color;

    this.context.beginPath();
    this.context.moveTo(realA[0], realA[1]);
    this.context.lineTo(realB[0], realB[1]);
    this.context.stroke();
  }

  drawPoint(point : Vector2D, name: string|undefined = undefined, radius = 2, color = 'black')
  {
    const realPoint = this.virtualVector2DToRealVector2D(point);
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(realPoint[0], realPoint[1], radius, 0, 2 * Math.PI);
    this.context.fill();
    
    if(name)
    {
      this.context.font = '15px Arial';
      this.context.fillStyle = color;
      this.context.textAlign = 'center';
      this.context.fillText(`${name}(${point[0]}|${point[1]})`, realPoint[0], realPoint[1]-10);
    }
  }
}

class Vector2D extends Array<number>
{
  constructor(vector: Array<number>)
  {
    if(vector.length != 2)
    {
      throw new Error('Vector2D has to be of length 2!');
    }

    super(...vector);
  }

  multiply(value: number): Vector2D
  {
    return new Vector2D([this[0] * value, this[1] * value]);
  }
}


const app = new DrawingApp();

app.drawGrid();

const pointA = new Vector2D([
  0,
  0
]);

const pointB = new Vector2D([
  10,
  10
]);

app.drawLine(pointA, pointB);

app.drawPoint(new Vector2D([
  15,
  15
]), 'P1');