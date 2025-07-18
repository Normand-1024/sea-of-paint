//@ts-ignore
import p5 from 'P5';
import { interpolateCmyk } from '../functions/imageProcessing.tsx';

// Normal blending math here: https://www.wikiwand.com/en/Alpha_compositing
export function normalBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, opacity : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] * opacity / 255;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let a3 = a2 + a1 * (1 - a2);
        let r3 = (r2 * a2 + r1 * a1 * (1 - a2)) / a3;
        let g3 = (g2 * a2 + g1 * a1 * (1 - a2)) / a3;
        let b3 = (b2 * a2 + b1 * a1 * (1 - a2)) / a3;

        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = a3 * 255;
    }

    output.updatePixels();
}

// Normal blending math but raw2 will be black and white
export function normalBNWBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, opacity : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] * opacity / 255;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let grey2 : number = (r2 + g2 + b2) / 3;
        r2 = grey2;
        g2 = grey2;
        b2 = grey2;

        let a3 = a2 + a1 * (1 - a2);
        let r3 = (r2 * a2 + r1 * a1 * (1 - a2)) / a3;
        let g3 = (g2 * a2 + g1 * a1 * (1 - a2)) / a3;
        let b3 = (b2 * a2 + b1 * a1 * (1 - a2)) / a3;

        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = a3 * 255;
    }

    output.updatePixels();
}

// Overlay blending math: https://dev.w3.org/SVG/modules/compositing/master/
export function overlayBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, opacity : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] * opacity / 255;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let r1a : number = r1 * a1;
        let g1a : number = g1 * a1;
        let b1a : number = b1 * a1;
        let r2a : number = r2 * a2;
        let g2a : number = g2 * a2;
        let b2a : number = b2 * a2;

        let a3 = a2 + a1 - a2 * a1;
        let r3, b3, g3;
        if (r1 <= 0.5) r3 = (2 * r1a * r2a + r2a * (1 - a1) + r1a * (1 - a2)) / a3; 
            else r3 = (r2a * (1 + a1) + r1a * (1 + a2) - 2 * r1a * r2a - a1 * a2) / a3;
        if (b1 <= 0.5) b3 = (2 * b1a * b2a + b2a * (1 - a1) + b1a * (1 - a2)) / a3; 
            else b3 = (b2a * (1 + a1) + b1a * (1 + a2) - 2 * b1a * b2a - a1 * a2) / a3;
        if (g1 <= 0.5) g3 = (2 * g1a * g2a + g2a * (1 - a1) + g1a * (1 - a2)) / a3; 
            else g3 = (g2a * (1 + a1) + g1a * (1 + a2) - 2 * g1a * g2a - a1 * a2) / a3;

        // // added an opacity setting for more flexibility with how intense the blending is -KK
        // r3 = r3 * opacity + r1 * (1 - opacity);
        // g3 = g3 * opacity + g1 * (1 - opacity);
        // b3 = b3 * opacity + b1 * (1 - opacity);

        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = a3 * 255;
    }

    output.updatePixels();
}

// Hard Light blending math: https://dev.w3.org/SVG/modules/compositing/master/
export function hardlightBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, opacity : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] * opacity / 255;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let r1a : number = r1 * a1;
        let g1a : number = g1 * a1;
        let b1a : number = b1 * a1;
        let r2a : number = r2 * a2;
        let g2a : number = g2 * a2;
        let b2a : number = b2 * a2;

        let a3 = a2 + a1 - (a1 * a2);
        let r3, b3, g3;
        if (r2 <= 0.5) r3 = (2 * r2a * r1a + r2a * (1 - a1) + r1a * (1 - a2)) / a3;
            else r3 = (r2a * (1 + a1) + r1a * (1 + a2) - a2 * a1 - 2 * r2a * r1a) / a3; 
        if (b2 <= 0.5) b3 = (2 * b2a * b1a + b2a * (1 - a1) + b1a * (1 - a2)) / a3;
            else b3 = (b2a * (1 + a1) + b1a * (1 + a2) - a2 * a1 - 2 * b2a * b1a) / a3;
        if (g2 <= 0.5) g3 = (2 * g2a * g1a + g2a * (1 - a1) + g1a * (1 - a2)) / a3;
            else g3 = (g2a * (1 + a1) + g1a * (1 + a2) - a2 * a1 - 2 * g2a * g1a) / a3;
        
        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = a3 * 255;
    }

    output.updatePixels();
}

export function cmykBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, ratio : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] / 255 * ratio;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let [r3, g3, b3] = interpolateCmyk
            ([r1 * 255, g1 * 255, b1 * 255],
             [r2 * 255, g2 * 255, b2 * 255],
             a2);

        output.pixels[i] = r3;
        output.pixels[i+1] = g3;
        output.pixels[i+2] = b3;
        output.pixels[i+3] = 255;
    }

    output.updatePixels();
}

export function pinLightBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, ratio : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] / 255 * ratio;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let r1a : number = r1 * a1;
        let g1a : number = g1 * a1;
        let b1a : number = b1 * a1;
        let r2a : number = r2 * a2;
        let g2a : number = g2 * a2;
        let b2a : number = b2 * a2;

        let a3 = a2 + a1 - (a1 * a2);
        let r3, b3, g3;

        if (r2 >= 0.5) r3 = (Math.max(r2a * a1, r1a * a2) + r2a * (1 - a1) + r1a * (1 - a2)) / a3; // lightnen
            else r3 = (Math.min(r2a * a1, r1a * a2) + r2a * (1 - a1) + r1a * (1 - a2)) / a3; // darken

        if (g2 >= 0.5) g3 = (Math.max(g2a * a1, g1a * a2) + g2a * (1 - a1) + g1a * (1 - a2)) / a3; // lightnen
            else g3 = (Math.min(g2a * a1, g1a * a2) + g2a * (1 - a1) + g1a * (1 - a2)) / a3; // darken

        if (b2 >= 0.5) b3 = (Math.max(b2a * a1, b1a * a2) + b2a * (1 - a1) + b1a * (1 - a2)) / a3; // lightnen
            else b3 = (Math.min(b2a * a1, b1a * a2) + b2a * (1 - a1) + b1a * (1 - a2)) / a3; // darken

        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = 255;
    }

    output.updatePixels();
}
