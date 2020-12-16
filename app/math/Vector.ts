export interface Coordinate {
  x: number;
  y: number;
}

export function same(c1: Coordinate, c2: Coordinate) {
  return c1.x === c2.x && c1.y === c2.y;
}

export function coordinateDistance(c1: Coordinate, c2: Coordinate) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export class Vector {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) { }

  public add(v: Vector) {
    return new Vector(
      this.x + v.x,
      this.y + v.y,
    );
  }

  public subtract(v: Vector) {
    return new Vector(
      this.x - v.x,
      this.y - v.y,
    );
  }

  public scalarMultiply(s: number) {
    return new Vector(
      this.x * s,
      this.y * s,
    );
  }

  public round() {
    return new Vector(
      Math.round(this.x),
      Math.round(this.y),
    );
  }

  public magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public getCoordinate() {
    return { x: this.x, y: this.y };
  }

  public dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  public normalUnit(): Vector {
    const magnitude = this.magnitude();
    return new Vector(this.y / magnitude, -this.x / magnitude);
  }
}

export class Transform {
  constructor(
    public readonly translation: Vector,
    public readonly scale: number,
  ) { }

  public setTranslation(translation: Vector) {
    return new Transform(
      translation,
      this.scale,
    );
  }

  public setScale(scale: number) {
    return new Transform(
      this.translation,
      scale,
    );
  }

  public apply(x: number, y: number) {
    return this.applyV(new Vector(x, y));
  }

  public applyV(point: Vector) {
    return point.scalarMultiply(1 / this.scale).subtract(this.translation);
  }

  public reverse(x: number, y: number) {
    return this.reverseV(new Vector(x, y));
  }

  public reverseV(point: Vector) {
    return point.add(this.translation).scalarMultiply(this.scale);
  }

  public applyScalar(x: number) {
    return x / this.scale;
  }

  public reverseScalar(x: number) {
    return x * this.scale;
  }

  public toSvg() {
    return `scale(${this.scale} ${this.scale}) translate(${this.translation.x} ${this.translation.y})`;
  }
}
