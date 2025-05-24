
import { Complex } from './Complex';

export class Matrix {
  static multiplyVector(matrix: Complex[][], vector: Complex[]): Complex[] {
    const result: Complex[] = [];
    
    for (let i = 0; i < matrix.length; i++) {
      result[i] = new Complex(0, 0);
      for (let j = 0; j < vector.length; j++) {
        const temp = matrix[i][j].clone().multiply(vector[j]);
        result[i].add(temp);
      }
    }
    
    return result;
  }

  static multiply(a: Complex[][], b: Complex[][]): Complex[][] {
    const result: Complex[][] = [];
    
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        result[i][j] = new Complex(0, 0);
        for (let k = 0; k < a[0].length; k++) {
          const temp = a[i][k].clone().multiply(b[k][j]);
          result[i][j].add(temp);
        }
      }
    }
    
    return result;
  }

  static tensorProduct(a: Complex[][], b: Complex[][]): Complex[][] {
    const result: Complex[][] = [];
    const aRows = a.length;
    const aCols = a[0].length;
    const bRows = b.length;
    const bCols = b[0].length;
    
    for (let i = 0; i < aRows * bRows; i++) {
      result[i] = [];
      for (let j = 0; j < aCols * bCols; j++) {
        const aRow = Math.floor(i / bRows);
        const aCol = Math.floor(j / bCols);
        const bRow = i % bRows;
        const bCol = j % bCols;
        
        result[i][j] = a[aRow][aCol].clone().multiply(b[bRow][bCol]);
      }
    }
    
    return result;
  }
}
