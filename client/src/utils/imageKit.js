import ImageKit from "imagekit-javascript";

export const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL,
});
