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

// this isn't working yet :( -KK
export function randomHue(p: p5, raw: p5.Image): p5.Image {
    // set the color mode to hsb for easy manipulation -KK
    p.colorMode(p.HSB, 360, 100, 100);

    for (let i = 0; i < raw.pixels.length; i += 4) {
        let r = raw.pixels[i];
        let g = raw.pixels[i + 1];
        let b = raw.pixels[i + 2];

        // convert from rgb to hsb then randomly adjust the hue -KK
        let hsbColor = p.rgbToHsb(r, g, b);
        hsbColor[0] = (hsbColor[0] + Math.random() * 360) % 360;
        let rgbColor = p.hsbToRgb(hsbColor[0], hsbColor[1], hsbColor[2]);

        raw.pixels[i] = rgbColor[0];
        raw.pixels[i + 1] = rgbColor[1];
        raw.pixels[i + 2] = rgbColor[2];
    }

    raw.updatePixels();

    // turn the color mode back to normal -KK
    p.colorMode(p.RGB, 255);
}
