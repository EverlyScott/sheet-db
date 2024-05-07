import { RecordModel } from "pocketbase";
import React from "react";

export type NextLayout = React.FC<React.PropsWithChildren>;

export type WithExpand<T, E> = T & { expand: E & { [key: string]: any } };

export type Keys =
  | "C"
  | "Am"
  | "F"
  | "Dm"
  | "Bb"
  | "Gm"
  | "Eb"
  | "Cm"
  | "Ab"
  | "Fm"
  | "C#"
  | "A#m"
  | "Db"
  | "Bbm"
  | "F#"
  | "D#m"
  | "Gb"
  | "Ebm"
  | "B"
  | "G#m"
  | "E"
  | "C#m"
  | "A"
  | "F#m"
  | "D"
  | "Bm"
  | "G"
  | "Em";

export interface Record extends RecordModel {
  id: string;
  created: string;
  updated: string;
}

export enum Collections {
  Users = "users",
  Arrangements = "arrangements",
  Artists = "artists",
  Lists = "lists",
  Parts = "parts",
  Pieces = "pieces",
}

export interface Artist extends Record {
  name: string;
  avatar: string;
  born: string;
  died: string;
}

export interface Piece extends Record {
  title: string;
  composers: string[];
}

export interface Arrangement extends Record {
  alternateName: string;
  piece: string;
  arrangers: string[];
  keys: Keys[];
  recordings: string[];
  instruments: string;
}

export interface Part extends Record {
  isScore: boolean;
  partName: string;
  arrangement: string;
  pdf: string;
}

export interface List extends Record {
  name: string;
  program: string;
  arrangements: string[];
}
