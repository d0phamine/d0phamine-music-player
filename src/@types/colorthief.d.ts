declare module 'colorthief' {
    export default class ColorThief {
      getColor(sourceImage: HTMLImageElement | null, quality?: number): [number, number, number];
      getPalette(sourceImage: HTMLImageElement | null, colorCount?: number, quality?: number): [number, number, number][];
    }
  }