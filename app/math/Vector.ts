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
    return point.add(this.translation).scalarMultiply(1 * this.scale);
  }

  public toSvg() {
    return `scale(${this.scale} ${this.scale}) translate(${this.translation.x} ${this.translation.y})`;
  }
}