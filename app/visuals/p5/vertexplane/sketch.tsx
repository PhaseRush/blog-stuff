"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";
import type p5 from "p5";
import { Vertex } from "./Vertex";
// @ts-ignore
import createKDTree from '../util/kdtree';

let vertices: Vertex[];
let coordinates: number[][] = [[], []];
let kdTree: any;
const kValue: number = 3;

let maxVertices: number;
let distanceThreshold: number;

const density = 0.004;
const fillShape: boolean = false;

export const sketch: Sketch = (p5) => {
    function init(): void {
        p5.background(0);
        p5.frameRate(300);
        p5.noStroke();
        p5.smooth();

        maxVertices = Math.floor(p5.width * p5.height / (100 / density));
        console.log(maxVertices);
        distanceThreshold = Math.floor(p5.width * p5.height / (1 / density)) * 2;
        console.log(distanceThreshold);
        vertices = Array.from({length: maxVertices}, _ => Vertex.createRandom());
        updateKdTree();
    }

    function render(v1: Vertex, v2: Vertex, v3: Vertex) {
        if (fillShape) {
            p5.stroke(255, 10);
            p5.fill(determineColour(v1, v2, v3));
        } else {
            p5.noFill();
            p5.strokeWeight(1);
            p5.stroke(determineColour(v1, v2, v3));
        }
        p5.beginShape(0x0004);
        p5.vertex(v1.x, v1.y);
        p5.vertex(v2.x, v2.y);
        p5.vertex(v3.x, v3.y);
        p5.endShape();
    }

    function updateKdTree() {
        for (let i = 0; i < maxVertices; i++) {
            coordinates[i] = [vertices[i].x, vertices[i].y];
        }
        kdTree = createKDTree(coordinates);
    }

    function determineColour(v1: Vertex, v2: Vertex, v3: Vertex): p5.Color {
        const dist12 = p5.dist(v1.x, v1.y, v2.x, v2.y);
        const dist23 = p5.dist(v2.x, v2.y, v3.x, v3.y);
        const dist13 = p5.dist(v1.x, v1.y, v3.x, v3.y);

        const c1: p5.Color = p5.color(v1.c);
        const c2: p5.Color = p5.color(v2.c);
        const c3: p5.Color = p5.color(v3.c);

        const colour12: p5.Color = p5.lerpColor(c1, c2, 0.5);
        const colour23: p5.Color = p5.lerpColor(c2, c3, 0.5);
        const colour13: p5.Color = p5.lerpColor(c1, c3, 0.5);

        const colorPre: p5.Color = p5.lerpColor(colour12, colour23,
            p5.min(dist12, dist23) / p5.max(dist12, dist23));
        const colorPost: p5.Color = p5.lerpColor(colorPre, colour13,
            p5.min(dist12 + dist23, dist13) / p5.max(dist12 + dist23, dist13));
        const area = p5.sqrt(
            (dist12 + dist23 + dist13) *
            (((-1) * dist12) + dist23 + dist13) *
            (dist12 + ((-1) * dist23) + dist13) *
            (dist13 + dist23 + ((-1) * dist13))) / 4;

        colorPost.setAlpha(area / 100.0);
        return colorPost;
    }

    p5.setup = () => {
        p5.createCanvas(p5.displayWidth / 2, p5.displayHeight / 2);
        Vertex.init(p5);
        init();
    };

    p5.draw = () => {
        if (p5.frameCount % 50 === 0) console.log("frameRate:\t" + p5.frameRate());
        updateKdTree();
        p5.background(0);

        for (let i = 0; i < maxVertices; i++) {
            const v1: Vertex = vertices[i];
            v1.update();
            v1.render();
            const kIndices: number[] = kdTree.knn([v1.x, v1.y], kValue, distanceThreshold);
            if (kIndices.length === kValue) {
                const v_1: Vertex = vertices[kIndices[0]];
                const v2: Vertex = vertices[kIndices[1]];
                const v3: Vertex = vertices[kIndices[2]];
                render(v_1, v2, v3);
            }
        }
    };
};

export default function VertexPlane() {
    return <P5Canvas sketch={sketch} />;
}
