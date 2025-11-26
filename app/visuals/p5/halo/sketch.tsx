"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";


let rOuter = 180;
let rInner = 18;

export const sketch: Sketch = (p5) => {
    function init(): void {
        p5.frameRate(60);
        p5.noStroke();
        p5.smooth();

        rOuter = p5.height / 8;
        rInner = p5.height / 144;
    }

    function renderTorus() {
        p5.push();
        p5.fill("white");
        // p5.noFill();
        // p5.stroke("#f7beff");
        p5.translate(-rOuter / 2, -p5.height / 4, 0);
        p5.rotateX(p5.PI / 2);
        p5.rotateZ(p5.millis() / 1000);
        // p5.emissiveMaterial();
        p5.torus(rOuter, rInner);
        p5.pop();
    }
    function renderSphere() {
        p5.push();
        p5.noFill();
        p5.stroke("#f7beff");
        p5.translate(-rOuter / 2, p5.height / 7, 0);
        p5.rotateY(p5.millis() / 1000);
        p5.sphere(rOuter);
        p5.pop();
    }

    p5.setup = () => {
        p5.createCanvas(p5.displayWidth / 2, p5.displayHeight / 2, p5.WEBGL);
        init();
    };


    p5.draw = () => {
        p5.background(100);
        p5.noStroke();
        renderTorus();
        renderSphere();
    };
};

export default function Halo() {
    return <P5Canvas sketch={sketch} />;
}