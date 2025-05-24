
export class Complex {
  public real: number;
  public imag: number;

  constructor(real: number, imag: number = 0) {
    this.real = real;
    this.imag = imag;
  }

  add(other: Complex): Complex {
    this.real += other.real;
    this.imag += other.imag;
    return this;
  }

  subtract(other: Complex): Complex {
    this.real -= other.real;
    this.imag -= other.imag;
    return this;
  }

  multiply(other: Complex): Complex {
    const newReal = this.real * other.real - this.imag * other.imag;
    const newImag = this.real * other.imag + this.imag * other.real;
    this.real = newReal;
    this.imag = newImag;
    return this;
  }

  divide(other: Complex): Complex {
    const denominator = other.real * other.real + other.imag * other.imag;
    const newReal = (this.real * other.real + this.imag * other.imag) / denominator;
    const newImag = (this.imag * other.real - this.real * other.imag) / denominator;
    this.real = newReal;
    this.imag = newImag;
    return this;
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  clone(): Complex {
    return new Complex(this.real, this.imag);
  }

  toString(): string {
    if (this.imag === 0) return this.real.toFixed(3);
    if (this.real === 0) return `${this.imag.toFixed(3)}i`;
    const sign = this.imag >= 0 ? '+' : '-';
    return `${this.real.toFixed(3)} ${sign} ${Math.abs(this.imag).toFixed(3)}i`;
  }

  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }
}
