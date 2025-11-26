import type { P5CanvasInstance } from "@p5-wrapper/react";
import type p5 from "p5";
import { randFromEnum } from "../util/util";

enum Colors {
    TURQUOISE = "#05CDE4",
    GOLD = "#FFB804",
    MAGENTA = "#FF0354",
    GREY = "#31343e"
}

export class Vertex {
    private static p5: P5CanvasInstance;
    private static readonly alpha = 90;
    private static readonly timeStep = 0.3;

    private _x: number;
    private _y: number;

    private readonly _r: number;
    private readonly _c: p5.Color;
    private readonly _cAlpha: string;

    private accY = Math.random() > 0.5 ? 1 : -1;
    private accX = Math.random() > 0.5 ? 1 : -1;

    static init(p: P5CanvasInstance): void {
        Vertex.p5 = p;
    }

    public static createRandom(): Vertex {
        let c: p5.Color = randFromEnum(Colors);

        return new Vertex(
            Vertex.p5.random(0, Vertex.p5.width),
            Vertex.p5.random(0, Vertex.p5.height),
            Vertex.p5.random(3, 7),
            c,
            c.toString("#rrggbb") + Vertex.alpha.toString(16)
        );
    }

    constructor(x: number, y: number, r: number, c: p5.Color, cAlpha: string) {
        this._x = x;
        this._y = y;
        this._r = r;
        this._c = c;
        this._cAlpha = cAlpha;
    }

    public update() {
        this.move();
    }

    private move() {
        this._x = this._x + this.accX * Vertex.timeStep * (1 + Math.random() / 10.0);
        this._y = this._y + this.accY * Vertex.timeStep * (1 + Math.random() / 10.0);

        this.checkBounds();
    }

    private checkBounds() {
        if (this._y > Vertex.p5.height - this._r) this.accY = -1;
        if (this._y < 0 + this._r) this.accY = 1;
        if (this._x > Vertex.p5.width - this._r) this.accX = -1;
        if (this._x < 0 + this._r) this.accX = 1;
    }

    public render() {
        Vertex.p5.push();
        Vertex.p5.noStroke();
        Vertex.p5.fill(this._c);
        Vertex.p5.ellipse(this._x, this._y, this._r, this._r);
        Vertex.p5.pop();
    }

    public toString = (): string => {
        return "Vertex: x: " + this.x + "\ty: " + this.y;
    };

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get r() {
        return this._r;
    }

    get c(): p5.Color {
        return this._c;
    }

    get cAlpha(): string {
        return this._cAlpha;
    }
}