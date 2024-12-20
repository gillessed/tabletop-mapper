import { getIpc } from "../../ipc/ipc";
import { SvgElementId } from "../svg/SvgElementId";

export async function exportSvgToImage(targetWidth: number) {
  const svgElement = document
    .getElementById(SvgElementId)
    .cloneNode(true) as HTMLElement;
  const svgElementWithDataUrls = await convertImagesToDataUrls(svgElement);

  const svgString = new XMLSerializer().serializeToString(
    svgElementWithDataUrls
  );
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });

  const svgUrl = URL.createObjectURL(svgBlob);
  const sourceWidth = +svgElement.getAttribute("width");
  const sourceHeight = +svgElement.getAttribute("height");
  const sourceAspectRatio = sourceHeight / sourceWidth;
  return await createImage(
    svgUrl,
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetWidth * sourceAspectRatio
  );
}

async function convertImagesToDataUrls(
  svgElement: HTMLElement
): Promise<HTMLElement> {
  const convertedUrls = new Map<string, string>();
  const images = svgElement.getElementsByTagName("image");
  for (let i = 0; i < images.length; i++) {
    const image = images.item(i);
    const link = image.getAttribute("href");
    const cachedValue = convertedUrls.get(link);
    if (cachedValue != null) {
      image.setAttribute("href", cachedValue);
    } else {
      const base64Data = await getIpc().fsReadFile({
        path: link,
        options: { encoding: "base64" },
      });
      const dataUrl = `data:image/png;base64,${base64Data}`;
      convertedUrls.set(link, dataUrl);
      image.setAttribute("href", dataUrl);
    }
  }
  return svgElement;
}

async function createImage(
  imageDataUrl: string,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  return new Promise(
    (resolve: (result: any) => void, reject: (result: any) => void) => {
      const image = new Image();
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      image.onload = function () {
        ctx.drawImage(
          image,
          0,
          0,
          sourceWidth,
          sourceHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );
        URL.revokeObjectURL(imageDataUrl);
        const pngImageData = canvas.toDataURL("image/png");
        resolve(pngImageData);
      };

      image.onerror = function () {
        reject("Error loading image");
      };

      image.src = imageDataUrl;
    }
  );
}
