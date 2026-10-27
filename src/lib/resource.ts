import { stringify } from "yaml";

import careerData from "@/data/career.json";
import certData from "@/data/certifications.json";
import educationData from "@/data/education.json";
import homeContent from "@/data/home.json";
import projectData from "@/data/projects.json";
import socialData from "@/data/socials.json";
import stackData from "@/data/stack.json";
import {
  careerSchema,
  certificationSchema,
  educationSchema,
  Project,
  projectSchema,
  socialSchema,
  stackSchema,
} from "./schemas";

// Builds the "View as YAML" versions of the site from the same data files the pages use

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toYaml = (doc: unknown) =>
  stringify(doc, { lineWidth: 0, defaultKeyType: "PLAIN" });

function projectSpec(p: Project) {
  const repo = p.links.find((l) => l.icon === "github")?.href;
  return {
    name: slug(p.name),
    status: p.status,
    description: p.description.replace(/`/g, ""),
    stack: p.tags,
    ...(repo && { repo }),
  };
}

export function engineerYaml() {
  const { name, role, location, headline, about, status } = homeContent;
  const career = careerSchema.parse(careerData).career;
  const education = educationSchema.parse(educationData).education;
  const stack = stackSchema.parse(stackData).stack;
  const certs = certificationSchema.parse(certData).certifications;
  const projects = projectSchema.parse(projectData).projects;
  const socials = socialSchema.parse(socialData).socials;

  return toYaml({
    apiVersion: "portfolio.dev/v1",
    kind: "Engineer",
    metadata: {
      name: slug(name),
      labels: {
        role: slug(role),
        location: slug(location) || "earth",
      },
      annotations: {
        "portfolio.dev/resume": `https://${homeContent.domain}/resume.pdf`,
      },
    },
    spec: {
      headline,
      about: about.join(" "),
      currentRole: { title: status.role, company: status.company },
      skills: Object.fromEntries(stack.map((g) => [g.category, g.items])),
      experience: career.flatMap((org) =>
        org.positions.map((p) => ({
          title: p.title,
          company: org.name,
          from: p.start,
          to: p.end ?? "present",
          highlights: p.description ?? [],
        })),
      ),
      education: education.flatMap((org) =>
        org.positions.map((p) => ({
          degree: p.title,
          school: org.name,
          from: p.start,
          to: p.end ?? "present",
        })),
      ),
      ...(certs.length > 0 && {
        certifications: certs.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          year: Number(c.year),
        })),
      }),
      projects: projects.map(projectSpec),
      contact: Object.fromEntries(
        socials.map((s) => [slug(s.name), s.href.replace(/^mailto:/, "")]),
      ),
    },
    status: {
      phase: "Available",
      conditions: [
        { type: "OpenToWork", status: "True", reason: "LookingForDevOpsRoles" },
      ],
    },
  });
}

export function projectsYaml() {
  const projects = projectSchema.parse(projectData).projects;
  return toYaml({
    apiVersion: "v1",
    kind: "List",
    items: projects.map((p) => ({
      apiVersion: "portfolio.dev/v1",
      kind: "Project",
      metadata: { name: slug(p.name), labels: { status: p.status } },
      spec: projectSpec(p),
    })),
  });
}
