//@ts-ignore
import p5 from 'P5';

// Normal blending math here: https://www.wikiwand.com/en/Alpha_compositing
export function normalBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] / 255;
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

// Overlay blending math: https://dev.w3.org/SVG/modules/compositing/master/
export function overlayBlend(raw1 : p5.Image, raw2 : p5.Image, output : p5.Image, opacity : number = 1.0){

    for (let i=0; i < output.pixels.length; i+=4) {
        let a1 : number = raw1.pixels[i+3] / 255;
        let r1 : number = raw1.pixels[i] / 255;
        let g1 : number = raw1.pixels[i+1] / 255;
        let b1 : number = raw1.pixels[i+2] / 255;
        let a2 : number = raw2.pixels[i+3] / 255;
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

        // added an opacity setting for more flexibility with how intense the blending is -KK
        r3 = r3 * opacity + r1 * (1 - opacity);
        g3 = g3 * opacity + g1 * (1 - opacity);
        b3 = b3 * opacity + b1 * (1 - opacity);

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
        let a2 : number = raw2.pixels[i+3] / 255;
        let r2 : number = raw2.pixels[i] / 255;
        let g2 : number = raw2.pixels[i+1] / 255;
        let b2 : number = raw2.pixels[i+2] / 255;

        let a3 = a2 + a1 - (a1 * a2);
        let r3, b3, g3;
        if (r2 <= 0.5) r3 = (2 * r1 * r2);
            else r3 = (1 - 2 * (1 - r1) * (1 - r2)); 
        if (b2 <= 0.5) b3 = (2 * b1 * b2);
            else b3 = (1 - 2 * (1 - b1) * (1 - b2)); 
        if (g2 <= 0.5) g3 = (2 * g1 * g2);
            else g3 = (1 - 2 * (1 - g1) * (1 - g2)); 

        r3 = r3 * opacity + r1 * (1 - opacity);
        g3 = g3 * opacity + g1 * (1 - opacity);
        b3 = b3 * opacity + b1 * (1 - opacity);
        
        output.pixels[i] = r3 * 255;
        output.pixels[i+1] = g3 * 255;
        output.pixels[i+2] = b3 * 255;
        output.pixels[i+3] = a3 * 255;
    }

    output.updatePixels();
}
