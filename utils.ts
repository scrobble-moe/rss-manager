import { printImage } from 'https:/x.nest.land/terminal_images@3.0.0/mod.ts';

export const drawImage = (url: string) => {
  printImage({
    path: url,
    width: 90,
  });
};
