import type { P5CanvasInstance } from "@p5-wrapper/react";
import type p5 from "p5";

const Defaults = {
    "colour": null as p5.Color | null,
    "alpha": 200,
    "radius": 1
};

export class FreePoint {
    private static p5: P5CanvasInstance;
    private static readonly noiseScale: number = 400.0;
    private static readonly border: number = 125.0;
    private static readonly epsilon: number = 0.01;
    private static allowOffScreen: boolean = true;
    // only matters for offscreen calculations when `allowOffscreen` is false
    private static offScreenThreshold: number = 200;

    private pos: p5.Vector;
    private dir: p5.Vector;
    private vel: p5.Vector;
    private speed: number = 1.0;

    private readonly _colourString: string;
    private readonly colour: p5.Color;
    private readonly radius: number;

    static init(p: P5CanvasInstance, allowOffScreen: boolean = true): void {
        FreePoint.p5 = p;
        this.allowOffScreen = allowOffScreen;
        Defaults.colour = p.color(255, 255, 255);
    }

    static create(colour?: p5.Color,
                  alpha: number = Defaults.alpha,
                  radius: number = Defaults.radius): FreePoint {
        const finalColour = colour || Defaults.colour!;
        return new FreePoint(
            FreePoint.p5.random(0, FreePoint.p5.width),
            FreePoint.p5.random(0, FreePoint.p5.height),
            finalColour,
            alpha,
            radius
        );
    }

    constructor(x: number, y: number, colour: p5.Color, alpha: number, radius: number) {
        this.pos = FreePoint.p5.createVector(x, y);
        this.dir = FreePoint.p5.createVector(0, 0);
        this.vel = FreePoint.p5.createVector(0, 0);
        this.radius = radius;
        // this._colourString = colour.toString("#rrggbb") + alpha.toString(16);
        this.colour = colour;
    }

    public update(): void {
        this.move();
        this.render();
    }

    private move(): void {
        const angle: number = FreePoint.p5.noise(
            this.pos.x / FreePoint.noiseScale,
            this.pos.y / FreePoint.noiseScale
        ) * FreePoint.p5.TWO_PI * FreePoint.noiseScale;

        this.dir.x = FreePoint.p5.cos(angle);
        this.dir.y = FreePoint.p5.sin(angle);
        this.vel = this.dir.copy();
        this.vel.mult(this.speed);
        this.pos.add(this.vel);

        this.speed = FreePoint.p5.max(0.05, this.speed - FreePoint.epsilon);
        this.handleEdge();
    }

    private handleEdge(): void {
        if (!FreePoint.allowOffScreen) {
            if (this.pos.x > FreePoint.p5.width + FreePoint.offScreenThreshold ||
                this.pos.x < -FreePoint.offScreenThreshold ||
                this.pos.y > FreePoint.p5.height + FreePoint.offScreenThreshold ||
                this.pos.y < -FreePoint.offScreenThreshold) {
                this.reset();
            }
        }
    }

    private reset(): void {
        this.pos.x = FreePoint.p5.random(FreePoint.border, FreePoint.p5.width);
        this.pos.y = FreePoint.p5.random(FreePoint.border, FreePoint.p5.height);
    }

    private render(): void {
        FreePoint.p5.fill(this.colour);
        FreePoint.p5.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }

    get colourString(): string {
        return this._colourString;
    }
}