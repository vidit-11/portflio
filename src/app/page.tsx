import ExperienceList from "@/components/home/ExperienceList";
import Profile from "@/components/home/Profile";
import ProjectCard from "@/components/home/ProjectCard";
import { Card, Section } from "@/components/home/Section";
import SideList from "@/components/home/SideList";
import Skills from "@/components/home/Skills";
import Snapshot from "@/components/home/Snapshot";
import { ChaosTarget } from "@/components/chaos/Chaos";
import DeployButton from "@/components/DeployButton";
import { YamlSwitch } from "@/components/yaml/ViewMode";
import Link from "next/link";

import careerData from "@/data/career.json";
import certData from "@/data/certifications.json";
import educationData from "@/data/education.json";
import homeContent from "@/data/home.json";
import projectData from "@/data/projects.json";
import socialData from "@/data/socials.json";
import stackData from "@/data/stack.json";
import { engineerYaml } from "@/lib/resource";
import {
  careerSchema,
  certificationSchema,
  educationSchema,
  homeStatsSchema,
  projectSchema,
  stackSchema,
} from "@/lib/schemas";

const FEATURED = 4;

export default function Home() {
  const career = careerSchema.parse(careerData).career;
  const education = educationSchema.parse(educationData).education;
  const projects = projectSchema.parse(projectData).projects;
  const stack = stackSchema.parse(stackData).stack;
  const certs = certificationSchema.parse(certData).certifications;
  const email = socialData.socials
    .find((s) => s.icon === "mail")
    ?.href.replace(/^mailto:/, "");

  const stats = homeStatsSchema.parse(homeContent.stats);

  return (
    <YamlSwitch
      yaml={engineerYaml()}
      command="kubectl get engineer vidit-singh -o yaml"
      filename="vidit-singh.yaml"
    >
      <article className="flex flex-col gap-16 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Profile className="lg:col-span-2" />
          <ChaosTarget pod="status">
            <Snapshot career={career} stats={stats} />
          </ChaosTarget>
        </div>

        <Section title="Skills">
          <ChaosTarget pod="skills">
            <Skills stack={stack} />
          </ChaosTarget>
        </Section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-4">
          <Section title="Experience" className="lg:col-span-2">
            <ChaosTarget pod="experience">
              <ExperienceList career={career} />
            </ChaosTarget>
          </Section>
          <div className="flex flex-col gap-10">
            <Section title="Education">
              <ChaosTarget pod="education">
                <SideList
                  items={education.flatMap((org) =>
                    org.positions.map((p) => ({
                      title: p.title,
                      subtitle: org.name,
                      meta: [
                        `${p.start.slice(-4)}–${p.end?.slice(-4) ?? "now"}`,
                        p.description?.[0],
                      ]
                        .filter(Boolean)
                        .join(" · "),
                    })),
                  )}
                />
              </ChaosTarget>
            </Section>
            {certs.length > 0 && (
              <Section title="Certifications">
                <ChaosTarget pod="certifications">
                  <SideList
                    items={certs.map((c) => ({
                      title: c.name,
                      subtitle: c.issuer,
                      meta: c.year,
                      href: c.href,
                    }))}
                  />
                </ChaosTarget>
              </Section>
            )}
          </div>
        </div>

        <Section
          title="Projects"
          link={{ href: "/projects", label: "All projects" }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.slice(0, FEATURED).map((project) => (
              <ChaosTarget
                key={project.name}
                pod={project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              >
                <ProjectCard project={project} />
              </ChaosTarget>
            ))}
          </div>
        </Section>

        <Card className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Get in touch
            </h2>
            <p className="text-muted-foreground">
              I&apos;m open to DevOps and SRE roles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <DeployButton />
            {email && (
              <Link href={`mailto:${email}`} className="link text-sm">
                {email}
              </Link>
            )}
          </div>
        </Card>
      </article>
    </YamlSwitch>
  );
}
