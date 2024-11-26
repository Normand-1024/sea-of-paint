//@ts-ignore
import p5 from 'P5';

export function brightness(raw : p5.Image, intensity : number = 1.0){

    for (let i=0; i < raw.pixels.length; i+=4) {
        let r1 : number = raw.pixels[i] / 255;
        let g1 : number = raw.pixels[i + 1] / 255;
        let b1 : number = raw.pixels[i + 2] / 255;

        // adjust rgb values by the intensity factor -KK
        let r2 = Math.min(1, r1 * intensity);
        let g2 = Math.min(1, g1 * intensity);
        let b2 = Math.min(1, b1 * intensity);

        raw.pixels[i] = r2 * 255;
        raw.pixels[i + 1] = g2 * 255;
        raw.pixels[i + 2] = b2 * 255;
        raw.pixels[i + 3] = raw.pixels[i + 3]; 
    }

    raw.updatePixels();
}
  
export function randomHue(raw: p5.Image) {
    let hue_adjustment = Math.random();

    for (let i = 0; i < raw.pixels.length; i += 4) {
        let r = raw.pixels[i];
        let g = raw.pixels[i + 1];
        let b = raw.pixels[i + 2];
  
        let hsv = rgbToHsv(r, g, b);
  
        hsv[0] = (hsv[0] + hue_adjustment) % 1;

        let rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);

        raw.pixels[i] = rgb[0];
        raw.pixels[i + 1] = rgb[1];
        raw.pixels[i + 2] = rgb[2];
    }
    raw.updatePixels();
}

export function saturation(raw: p5.Image, saturation_adjustment: number) {
    for (let i = 0; i < raw.pixels.length; i += 4) {
        let r = raw.pixels[i];
        let g = raw.pixels[i + 1];
        let b = raw.pixels[i + 2];
  
        let hsv = rgbToHsv(r, g, b);
  
        hsv[1] += saturation_adjustment;

        let rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);

        raw.pixels[i] = rgb[0];
        raw.pixels[i + 1] = rgb[1];
        raw.pixels[i + 2] = rgb[2];
    }
    raw.updatePixels();
}
  
function rgbToHsv(r: number, g: number, b: number) {
    // normalize rgb values
    r /= 255;
    b /= 255;
    g /= 255;

    // calculate the initial values -KK
    let Cmax = Math.max(r, g, b);
    let Cmin = Math.min(r, g, b);
    let delta = Cmax - Cmin;

    let h = 0;  // calculate hue here -KK
    if (delta != 0) {
        if ( Cmax === r ) h = 60 * (((g - b) / delta) % 6);
        if ( Cmax === g ) h = 60 * (((b - r) / delta) + 2);
        if ( Cmax === b ) h = 60 * (((r - g) / delta) + 4);
    }

    // make sure hue is positive and convert to range [0,1] -KK
    if (h < 0) h += 360; 
    h /= 360;
    
    let s = (Cmax == 0 ? 0 : delta / Cmax);
    let v = Cmax;   // saturation and value are easy luckily -KK
  
    return [h, s, v];
}

function hsvToRgb(h: number, s: number, v: number) {

    // calculate initial values -KK
    let c = v * s;                
    let x = c * (1 - Math.abs((h * 6) % 2 - 1)); 
    let m = v - c;     
    
    let r = 0; let g = 0; let b = 0;    // calculate the new rgb values -KK
    if (h >= 0 && h < 1 / 6)          { r = c; g = x; b = 0; }
    else if (h >= 1 / 6 && h < 2 / 6) { r = x; g = c; b = 0; } 
    else if (h >= 2 / 6 && h < 3 / 6) { r = 0; g = c; b = x; } 
    else if (h >= 3 / 6 && h < 4 / 6) { r = 0; g = x; b = c; } 
    else if (h >= 4 / 6 && h < 5 / 6) { r = x; g = 0; b = c; } 
    else if (h >= 5 / 6 && h <= 1)    { r = c; g = 0; b = x; }

    // add m to match lightness and multiply to final value -KK
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}
  
