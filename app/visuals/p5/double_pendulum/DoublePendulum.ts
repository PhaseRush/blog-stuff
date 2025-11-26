import type { P5CanvasInstance } from "@p5-wrapper/react";
import type p5 from "p5";
import {RingBuffer} from "../util/RingBuffer";
import {SimplePoint2D} from "../util/util";

export class DoublePendulum {

    private readonly p5: P5CanvasInstance;
    private readonly r1: number;
    private readonly g: number;
    private readonly r2: number;
    private readonly m1: number;
    private readonly m2: number;
    private a1: number;
    private a2: number;
    private a1_v: number;
    private a2_v: number;
    private readonly cx: number;
    private readonly cy: number;
    private readonly nodeColor: p5.Color;
    private readonly historyColor: p5.Color;
    private histLength: number = 255;
    private readonly _history: RingBuffer<SimplePoint2D>;
    private readonly drawHistory: boolean;
    private readonly drawArms: boolean;
    private readonly drawNodes: boolean;

    private tip: SimplePoint2D;

    constructor(p: P5CanvasInstance, g: number, r1: number, r2: number, m1: number, m2: number, a1: number, a2: number, a_v1: number, a_v2: number,
                cx: number, cy: number, nodeColor: p5.Color, historyColor: p5.Color, histLength: number,
                drawHistory: boolean, drawArms: boolean, drawNodes: boolean) {
        this.p5 = p;
        this.g = g;
        this.r1 = r1;
        this.r2 = r2;
        this.m1 = m1;
        this.m2 = m2;
        this.a1 = a1;
        this.a2 = a2;
        this.a1_v = a_v1;
        this.a2_v = a_v2;
        this.cx = cx;
        this.cy = cy;
        this.nodeColor = nodeColor;
        this.historyColor = historyColor;
        this.histLength = histLength;
        this.drawHistory = drawHistory;
        this.drawArms = drawArms;
        this.drawNodes = drawNodes;
        if (drawHistory) {
            this._history = new RingBuffer<SimplePoint2D>(histLength);
        }
    }

    public update() {
        // a1 acceleration
        const numer1 = -this.g * (2 * this.m1 + this.m2) * this.p5.sin(this.a1);
        const numer2 = -this.m2 * this.g * this.p5.sin(this.a1 - 2 * this.a2);
        const numer3 = -2 * this.p5.sin(this.a1 - this.a2) * this.m2;
        const numer4 = (this.a2_v * this.a2_v) * this.r2 + (this.a1_v * this.a1_v) * this.r1 * this.p5.cos(this.a1 - this.a2);
        const denom = this.r1 * (2 * this.m1 + this.m2 - this.m2 * this.p5.cos(2 * this.a1 - 2 * this.a2));
        const a1_a = (numer1 + numer2 + numer3 * numer4) / denom;

        // a2 acceleration
        const n1 = 2 * this.p5.sin(this.a1 - this.a2);
        const n2 = (this.a1_v * this.a1_v) * this.r1 * (this.m1 + this.m2);
        const n3 = this.g * (this.m1 + this.m2) * this.p5.cos(this.a1);
        const n4 = (this.a2_v * this.a2_v) * this.r2 * this.m2 * this.p5.cos(this.a1 - this.a2);
        const den = this.r2 * (2 * this.m1 + this.m2 - this.m2 * this.p5.cos(2 * this.a1 - 2 * this.a2));
        const a2_a = (n1 * (n2 + n3 + n4)) / den;

        this.p5.translate(this.cx, this.cy);
        this.p5.stroke(255);
        this.p5.strokeWeight(5);

        const x1 = this.r1 * this.p5.sin(this.a1);
        const y1 = this.r1 * this.p5.cos(this.a1);
        const x2 = x1 + this.r2 * this.p5.sin(this.a2);
        const y2 = y1 + this.r2 * this.p5.cos(this.a2);

        if (this.drawNodes) {
            this.p5.fill(this.nodeColor);
            this.p5.ellipse(x1, y1, this.m1, this.m1);
            this.p5.fill(this.nodeColor);
            this.p5.ellipse(x2, y2, this.m2, this.m2);
        }

        if (this.drawArms) {
            this.p5.fill(255);
            this.p5.line(0, 0, x1, y1);
            this.p5.fill(255);
            this.p5.line(x1, y1, x2, y2);
        }

        this.a1_v += a1_a;
        this.a2_v += a2_a;
        this.a1 += this.a1_v;
        this.a2 += this.a2_v;

        if (this.drawHistory) {
            this.renderHistory(a2_a);
            this._history.push({x: x2, y: y2});
        }
        this.tip = {x: x2, y: y2};
        this.p5.translate(-this.cx, -this.cy);
    }

    private renderHistory(a2_a: number) {
        for (let idx = 0; idx < this._history.getLength(); idx++) {
            // scale transparency based on index (0 max, size dim)
            let vec = this._history.get(idx);
            if (!vec) continue;
            this.historyColor.setAlpha(this.p5.max(idx, 20)); // clamp alpha
            this.p5.fill(this.historyColor);
            this.p5.strokeWeight(0);
            const radiusMultiplier: number = this.p5.max(this.p5.sqrt(this.p5.abs(a2_a)), 1); // scale size based on a_a
            this.p5.ellipse(vec.x, vec.y, this.m2 / radiusMultiplier, this.m2 / radiusMultiplier);
        }
    }

    get history(): RingBuffer<SimplePoint2D> {
        return this._history;
    }

    public getTip(): SimplePoint2D {
        return this.tip;
    }
}