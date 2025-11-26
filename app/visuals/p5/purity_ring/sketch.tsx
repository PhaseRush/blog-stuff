"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";
import { DoublePendulum } from "../double_pendulum/DoublePendulum";
import { frameEpsilon, SimplePoint2D } from "../util/util";

let vertices: SimplePoint2D[] = [];
let numSides = 100;
let pendulum: DoublePendulum;

interface Polygon {
    x: number,
    y: number,
    strokeColor: string;
}

// choose one of these two polygons. empty version will generate polygons based off of numPolySets
const numPolySets = 3;
// const polygons: Polygon[] = [];

const polygons: Polygon[] = [{
    x: 1000,
    y: 1000,
    strokeColor: "#FF0000"
}, {
    x: 2000,
    y: 2000,
    strokeColor: "#00FF00"
}, {
    x: 3000,
    y: 3000,
    strokeColor: "#0000FF"
}];

export const sketch: Sketch = (p5) => {
    function initPendulum() {
        const r1 = p5.height / 6;
        const r2 = p5.height / 3;
        const m1 = 20;
        const m2 = 10;
        const a1 = p5.PI / p5.randomGaussian(2, 0.4) * p5.random([1, -1]);
        const a2 = p5.PI / p5.randomGaussian(2, 0.4) * p5.random([1, -1]);
        const a_v1 = 0;
        const a_v2 = 0;
        const cx = p5.width / 2;
        const cy = p5.height / 4;
        const nodeColor = p5.color(255,255,255);
        const historyColour = p5.color(255,255,255);

        pendulum = new DoublePendulum(
            p5, 1, r1, r2, m1, m2, a1, a2, a_v1, a_v2, cx, cy, nodeColor, historyColour, 255,
            true, false, false
        );
    }

    function restoreRingSettings() {
        p5.strokeWeight(12);
        p5.noFill();
        p5.noStroke();
    }

    function initPolygons() {
        const posIncr = 2000;
        const cUnit = Math.floor(0xff / numPolySets);
        for (let i = 1; i < numPolySets + 1; i++) {
            // console.log("red\t\t#" + (cUnit * (i)).toString(16) + "0000");
            const redPoly: Polygon = {
                x: i * posIncr / 3,
                y: i * posIncr / 3,
                strokeColor: "#" + (cUnit * (i)).toString(16) + "0000"
            };
            // console.log("green\t#00" + (cUnit * (i)).toString(16) + "00");
            const greenPoly: Polygon = {
                x: i * posIncr * 2 / 3,
                y: i * posIncr * 2 / 3,
                strokeColor: "#00" + (cUnit * (i)).toString(16) + "00"
            };
            // console.log("blue\t#0000" + (cUnit * (i)).toString(16));
            const bluePoly: Polygon = {
                x: i * posIncr,
                y: i * posIncr,
                strokeColor: "#0000" + (cUnit * (i)).toString(16)
            };
            polygons.push(redPoly, greenPoly, bluePoly);
        }
    }

    function init(): void {
        p5.background(0);
        p5.frameRate(60);

        restoreRingSettings();
        numSides++;

        for (let i = 0; i < numSides; i++) {
            vertices.push({
                x: (p5.width / 2) + (p5.height / 5) * p5.sin(p5.map(i, 0, numSides - 1, 0, p5.TAU)),
                y: (p5.height / 2) + (p5.height / 5) * p5.cos(p5.map(i, 0, numSides - 1, 0, p5.TAU))
            })
        }

        // only procedurally generate polygons if user defined none
        if (polygons.length === 0) {
            initPolygons();
        }

        initPendulum();
    }

    // based off of linear regression + existing p5.map function
    function logMap(value: number, start1: number, stop1: number, start2: number, stop2: number) {
        start2 = p5.log(start2);
        stop2 = p5.log(stop2);
        return p5.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
    }

    type distortionFunctionType = (x: number, y: number) => number;

    function mouseDistance(x: number, y: number): number {
        return p5.dist(p5.mouseX, p5.mouseY, x, y);
    }

    function pendulumDistance(x: number, y: number): number {
        return p5.dist(pendulum.getTip().x, pendulum.getTip().y, x, y) / 4;
    }

    // allow for simulated mouse positions
    function drawPoly(dx: number, dy: number, distortionFunction: distortionFunctionType = mouseDistance) {
        p5.beginShape();
        vertices.forEach(vertex => {
            let distortion = distortionFunction(vertex.x, vertex.y);
            p5.vertex(vertex.x + dx / logMap(distortion, p5.width, 0, dx, 45),
                vertex.y + dy / logMap(distortion, p5.height, 0, dy, 45))
        });
        p5.endShape();
    }

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth / 2, p5.windowHeight, p5.WEBGL);
        init();
    };

    p5.draw = () => {
        // use default blend mode for background
        p5.blendMode(p5.BLEND);
        p5.background(0);

        if (p5.frameCount % (p5.frameRate() * 180) < frameEpsilon) { // every 3 minutes
            initPendulum();
        }

        pendulum.update();

        // use additive blend mode to separate color channels
        restoreRingSettings();
        p5.blendMode(p5.ADD);

        polygons.forEach(gon => {
            p5.stroke(gon.strokeColor);
            drawPoly(gon.x, gon.y, pendulumDistance);
        });
    };
};

export default function PurityRing() {
    return <P5Canvas sketch={sketch} />;
}
