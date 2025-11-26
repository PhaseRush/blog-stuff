"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";

export const sketch: Sketch = (p5) => {
    p5.setup = () => {
        console.log("qwerty ", p5.windowWidth, p5.windowHeight)
        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    }

    // p5.mousePressed = () => {
    //     console.log("qwerty 2")
    //     p5.fullscreen(!p5.fullscreen());
    // }

    p5.draw = () => {
        p5.background(50);
        p5.normalMaterial();
        p5.push();
        p5.rotateZ(p5.frameCount * 0.01);
        p5.rotateX(p5.frameCount * 0.01);
        p5.rotateY(p5.frameCount * 0.01);
        p5.plane(100);
        p5.pop();
    };
};

export default function Sample() {
    return <P5Canvas sketch={sketch} />;
}