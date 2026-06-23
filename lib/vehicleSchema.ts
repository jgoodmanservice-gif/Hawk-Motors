import { z } from "zod";

export const mediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO_WALKAROUND", "VIDEO_INTERIOR", "VIDEO_YOUTUBE", "VIDEO_VIMEO", "DOCUMENT"]).default("IMAGE"),
  url: z.string().min(1),
  embedUrl: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  position: z.number().int().default(0),
});

export const vehicleSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "DRAFT"]).default("AVAILABLE"),
  featured: z.boolean().default(false),
  price: z.coerce.number().int().min(0),
  makeId: z.string().min(1),
  modelId: z.string().min(1),
  fuelTypeId: z.string().optional().nullable(),
  bodyStyleId: z.string().optional().nullable(),
  colourId: z.string().optional().nullable(),
  variant: z.string().optional().nullable(),
  year: z.coerce.number().int().min(1950).max(2100),
  registration: z.string().optional().nullable(),
  mileage: z.coerce.number().int().min(0),
  engineSize: z.string().optional().nullable(),
  horsepower: z.coerce.number().int().optional().nullable(),
  transmission: z.string().optional().nullable(),
  drivetrain: z.string().optional().nullable(),
  doors: z.coerce.number().int().optional().nullable(),
  seats: z.coerce.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  serviceHistory: z.string().optional().nullable(),
  motExpiry: z.string().optional().nullable(), // ISO date string
  owners: z.coerce.number().int().optional().nullable(),
  warranty: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  media: z.array(mediaSchema).default([]),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
