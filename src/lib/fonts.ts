import { Archivo } from "next/font/google";

const archivoRegular = Archivo({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivoMedium = Archivo({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const archivoSemibold = Archivo({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

const archivoBold = Archivo({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const archivoThin = Archivo({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

export const archivo = {
  regular400: archivoRegular,
  medium500: archivoMedium,
  semibold600: archivoSemibold,
  bold700: archivoBold,
  thin300: archivoThin,
};
