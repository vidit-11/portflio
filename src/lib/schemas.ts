import { icons, type IconName } from "@/components/Icon";
import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .min(2, { message: "Must be at least 2 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email."),
  message: z.string().min(1, { message: "Message is required." }),
});

const iconLink = z.object({
  name: z.string(),
  href: z.string().url(),
  icon: z.custom<IconName>((v) => typeof v === "string" && v in icons, {
    message: "Unknown icon name; add it to src/components/Icon.tsx",
  }),
});
export type IconLink = z.infer<typeof iconLink>;

// Interactive diagram shown on project cards; positions are in a 500×300 canvas
const diagram = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      x: z.number().min(0).max(500),
      y: z.number().min(0).max(300),
      note: z.string(),
    }),
  ),
  // [from, to] or [from, to, "hv" | "vh"] to force which way the connector bends
  edges: z.array(z.tuple([z.string(), z.string()]).rest(z.enum(["hv", "vh"]))),
  // Dashed boundary boxes, e.g. "AWS" or "k3s cluster"
  groups: z
    .array(
      z.object({
        label: z.string(),
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
      }),
    )
    .optional(),
});
export type Diagram = z.infer<typeof diagram>;

const project = z.object({
  name: z.string(),
  description: z.string(),
  href: z.string().url().optional(),
  image: z.string().optional(),
  status: z
    .enum(["deployed", "maintained", "completed", "archived"])
    .default("deployed"),
  architecture: diagram.optional(),
  // optional second diagram, e.g. the CI/CD flow
  pipeline: diagram.optional(),
  tags: z.array(z.string()),
  links: z.array(iconLink),
});
export const projectSchema = z.object({ projects: z.array(project) });
export type Project = z.infer<typeof project>;

const experiencePosition = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  description: z.array(z.string()).optional(),
  links: z.array(iconLink).optional(),
});
export type ExperiencePosition = z.infer<typeof experiencePosition>;

const experience = z.object({
  name: z.string(),
  href: z.string(),
  logo: z.string().optional(),
  positions: z.array(experiencePosition).min(1),
});
export type Experience = z.infer<typeof experience>;

export const careerSchema = z.object({ career: z.array(experience) });
export const educationSchema = z.object({ education: z.array(experience) });
export const socialSchema = z.object({ socials: z.array(iconLink) });

const stackGroup = z.object({
  category: z.string(),
  items: z.array(z.string()).min(1),
});
export type StackGroup = z.infer<typeof stackGroup>;
export const stackSchema = z.object({ stack: z.array(stackGroup) });

const certification = z.object({
  name: z.string(),
  issuer: z.string(),
  year: z.string(),
  href: z.string().url().optional(),
});
export type Certification = z.infer<typeof certification>;
export const certificationSchema = z.object({
  certifications: z.array(certification),
});

export const homeStatsSchema = z.array(
  z.object({ title: z.string(), value: z.string() }),
);
