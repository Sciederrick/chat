import { filename } from "pathe/utils";

export const useUtils = () => {
  const useInitials = function (fullName: string): string {
    let initials = "";
    fullName
      .split(" ")
      .forEach((name) => (initials += name.charAt(0).toUpperCase()));
    return initials.substring(0, 2);
  };

  const useHexRandomColor = function (): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const useLightenHexColor = function (hex: string, percent: number): string {
    // Increase brightness by __%
    // Remove the leading '#' if present
    hex = hex.replace("#", "");

    // Convert the hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the new RGB values
    const newR = Math.min(255, r + (255 - r) * (percent / 100));
    const newG = Math.min(255, g + (255 - g) * (percent / 100));
    const newB = Math.min(255, b + (255 - b) * (percent / 100));

    // Convert the new RGB values back to hex
    const newHex = `#${Math.round(newR)
      .toString(16)
      .padStart(2, "0")}${Math.round(newG)
      .toString(16)
      .padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;

    return newHex;
  };

  /**
   * Work around for dynamic images with Vite because require() doesn't work
   */
  const useAssetImages = function () {
    type TemplateImages = {
      [key: string]: string;
    };
    let templateImages: TemplateImages;
    const glob = import.meta.glob("~/assets/*.svg", { eager: true });
    const images = Object.fromEntries(
      Object.entries(glob).map(([key, value]: [string, any]) => [
        filename(key),
        value.default,
      ])
    );
    templateImages = images as TemplateImages;

    return templateImages;
  };

  /**
   * Create human readable time format
   */
  const useHumanReadableDate = function (dateStr: string) :string {
    let today = new Date()
    let yesterday = useGetYesterdaysDate(today);
    let inputDate = new Date(dateStr)
    if (inputDate.toDateString() == today.toDateString())
      return "today";
    else if (inputDate.toDateString() == yesterday.toDateString())
      return "yesterday";
    else
      return dateStr;
  }

  const useHumanReadableTime = function (dateTimeStr: string) :string {
    return dateTimeStr.split("T")[1].slice(0, 5)
  }

  const useGetYesterdaysDate = function (today: Date) :Date {
    const yesterday = new Date(today);
    return new Date(yesterday.setDate(today.getDate() - 1));
  } 

  return {
    useInitials,
    useHexRandomColor,
    useLightenHexColor,
    useAssetImages,
    useHumanReadableDate,
    useHumanReadableTime    
  };
};
