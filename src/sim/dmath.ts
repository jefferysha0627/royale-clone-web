// 跨瀏覽器一致的數學函式。JS 規定加減乘除與 Math.sqrt 是 IEEE 754 正確捨入，所以每個引擎結果相同；
// 但 Math.sin／cos／hypot 的最後一位可能因引擎（Chrome、Safari…）而異。模擬只用這裡的版本，
// 同一份重播在不同手機上才會跑出一模一樣的對戰。

const PI = 3.141592653589793;
const HALF_PI = 1.5707963267948966;
const TWO_PI = 6.283185307179586;

/** √(x² + y²)。 */
export function len(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/** sin：縮到 [−π/2, π/2] 後用泰勒展開到 x¹⁵（誤差約 1e−11，對模擬已足夠，重點是每個引擎都一樣）。 */
export function dsin(x: number): number {
  x -= TWO_PI * Math.round(x / TWO_PI);
  if (x > HALF_PI) x = PI - x;
  else if (x < -HALF_PI) x = -PI - x;
  const x2 = x * x;
  return (
    x *
    (1 +
      x2 *
        (-1 / 6 +
          x2 * (1 / 120 + x2 * (-1 / 5040 + x2 * (1 / 362880 + x2 * (-1 / 39916800 + x2 * (1 / 6227020800 + x2 * (-1 / 1307674368000))))))))
  );
}

export function dcos(x: number): number {
  return dsin(x + HALF_PI);
}
