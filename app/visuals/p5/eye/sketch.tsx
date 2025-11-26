"use client";

import { P5Canvas, type Sketch } from "@p5-wrapper/react";

let samplesPerFrame = 2;
let numFrames = 100;
let shutterAngle = 1.5;
let n = 999;
let points: any[];
let shaders: any;
const textures = new Array(samplesPerFrame);
let time: number[] = [];
let w2: number, h2: number;
let radius: number, x: number, y: number;

let vs = `
    precision mediump float;

    attribute vec3 aPosition;

    void main() {
        gl_Position = vec4(aPosition, 1.0);
    }
`;

let fs = `
    precision mediump float;

    uniform vec2 resolution;
    uniform float time;

		${
    new Array(samplesPerFrame)
        .fill(0)
        .map((d, i) => `uniform sampler2D tex${i};`)
        .join('')}

    void main() {
		vec2 pos = gl_FragCoord.xy / resolution.xy;
		vec4 c = vec4(0);
		${
    new Array(samplesPerFrame)
        .fill(0)
        .map((d, i) => `c += texture2D(tex${i}, pos);\n\t`)
        .join('')}

        c /= float(${samplesPerFrame});
        gl_FragColor = c;
    }
`;

export const sketch: Sketch = (p5) => {
    function generatePoints() {
        points = new Array(n)
            .fill(0)
            .map((d, i) => ({
                cos: p5.cos(p5.TWO_PI * i / n),
                sin: p5.sin(p5.TWO_PI * i / n),
                idx: i / n,
                size: p5.random(1, 5),
                offset: p5.random(10)
            }));

        points.forEach(pt => {
            pt.rads = {};
            time.forEach(t => pt.rads[t] = 150 + 80 * p5.sin(p5.TWO_PI * t + pt.offset));
        })
    }

    function render(tex, t) {
        points.forEach(pt => {
            x = w2 + pt.rads[t] * pt.cos;
            y = h2 + pt.rads[t] * pt.sin;
            tex.stroke(p5.color(pt.idx, 1, 1))
            tex.point(x, y);
        });
    }

    function init(): void {
        p5.background(0);
        p5.frameRate(600);
        p5.noStroke();
        p5.smooth();
    }

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth / 2, p5.windowHeight, p5.WEBGL);
        init();
        p5.colorMode(p5.HSB, 1)

        console.clear();

        for (let j = 0; j < numFrames; j++) {
            for (let i = 0; i < samplesPerFrame; i++) {
                time.push(p5.map(j + i * shutterAngle / samplesPerFrame, 0, numFrames, 0, 1));
            }
        }

        generatePoints();
        p5.pixelDensity(1);
        w2 = p5.width / 2;
        h2 = p5.height / 2;

        shaders = p5.createShader(vs, fs);
        console.log(vs)
        console.log(fs)
        p5.shader(shaders);
        shaders.setUniform('resolution', [p5.width, p5.height]);

        for (let i = 0; i < samplesPerFrame; i++) {
            textures[i] = p5.createGraphics(p5.width, p5.height, p5.WEBGL);
            shaders.setUniform(`tex${i}`, textures[i]);
        }
    };

    p5.draw = () => {
        for (let i = 0; i < samplesPerFrame; i++) {
            textures[i].push();
            textures[i].translate(-w2, -h2);
            render(textures[i], time[i + ((p5.frameCount - 1) % numFrames) * samplesPerFrame]);
            textures[i].pop();
        }

        p5.quad(-1, -1, -1, 1, 1, 1, 1, -1);

        if (p5.frameCount % 10 == 0) console.log(p5.frameRate())
    };
};

export default function Eye() {
    return <P5Canvas sketch={sketch} />;
}
