"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";
import { FreePoint } from "./FreePoint";

let maxPoints: number;
const isSlowStart: boolean = true;
const allowOffScreen: boolean = true;
const populationRate: number = 1;
const blurAlpha: number = 1;
const autoReset: number = 300;
const frameRate: number = 60;

let pointsA: Array<FreePoint> = [];
let pointsB: Array<FreePoint> = [];
let pointsC: Array<FreePoint> = [];

let isLooping: boolean = false;
let frameCount: number = 0;

const Colour: any = {
    A: null,
    B: null,
    C: null
};

export const sketch: Sketch = (p5) => {
    function init(): void {
        frameCount = 0;
        p5.background(0);
        p5.frameRate(frameRate);
        p5.noStroke();
        p5.smooth();
        maxPoints = p5.width * p5.height / 12384;

        Colour.A = p5.color(69, 33, 124);
        Colour.B = p5.color(7, 153, 242);
        Colour.C = p5.color(255, 255, 255);

        pointsA = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.A));
        pointsB = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.B));
        pointsC = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.C));
    }

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth / 2, p5.windowHeight, p5.WEBGL);
        FreePoint.init(p5, allowOffScreen);
        init();
    };

    p5.draw = () => {
        console.log(frameCount);
        if (frameCount++ >= frameRate * autoReset) {
            init();
            return;
        }
        p5.background(0, 0, 0, blurAlpha);

        if (isSlowStart) {
            const currSize = pointsA.length;
            if (currSize < maxPoints && p5.frameCount % populationRate == 0) {
                const radius = p5.map(currSize, 0, maxPoints, 1, 2);
                const alpha = p5.map(currSize, 0, maxPoints, 0, 200);
                pointsA.push(FreePoint.create(Colour.A, alpha, radius));
                pointsB.push(FreePoint.create(Colour.B, alpha, radius));
                pointsC.push(FreePoint.create(Colour.C, alpha, radius));
            }
        }

        pointsA.forEach(point => point.update());
        pointsB.forEach(point => point.update());
        pointsC.forEach(point => point.update());
    };

    p5.keyPressed = () => {
        switch (p5.keyCode) {
            case 'R'.charCodeAt(0):
                init();
                break;
            case 'P'.charCodeAt(0):
            case ' '.charCodeAt(0):
                if (isLooping) {
                    isLooping = false;
                    p5.noLoop();
                } else {
                    isLooping = true;
                    p5.loop();
                }
                break;
        }
    };
};

export default function Topography() {
    return <P5Canvas sketch={sketch} />;
}