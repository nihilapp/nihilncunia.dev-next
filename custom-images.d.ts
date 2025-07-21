type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.png' {
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  const svg: React.JSX.Element<React.SVGProps<SVGSVGElement>>;
  export default svg;
}

declare module '*.jpg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;
  export default content;
}

declare module '*.ico' {
  const content: StaticImageData;
  export default content;
}

declare module '*.bmp' {
  const content: StaticImageData;
  export default content;
}
