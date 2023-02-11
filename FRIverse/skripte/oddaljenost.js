/**
 * IzraÄunaj oddaljenost dveh točke
 * 
 * @param x1, x koordinata prve točke
 * @param y1, y koordinata prve točke
 * @param x2, x koordinata druge točke
 * @param y2, y koordinata druge točke
 * @return {oddaljenost v pikslih}
 */
 function oddaljenostTock(x1, y1, x2, y2) {
    var aa = x1 - x2;
    var bb = y1 - y2;
  
    return Math.sqrt(aa * aa + bb * bb);
  }