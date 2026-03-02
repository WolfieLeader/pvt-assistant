import { nanoid } from "nanoid";
import { z } from "zod";

export const zStr = z.string().trim();
export const zText = zStr.min(1);
export const zId = zText.default(() => nanoid());
export const zInt = z.int();
export const zTitle = zText.max(200);
export const zNote = zStr.max(1000).optional();
export const zCents = zInt.min(1);
export const zIntervals = zInt.min(1).max(4).optional();
export const zPriority = zInt.min(1).max(3).default(2);
