import ProjectGrid from "@/components/home/ProjectGrid";
import PageHeader from "@/components/PageHeader";
import { YamlSwitch } from "@/components/yaml/ViewMode";
import data from "@/data/projects.json";
import { projectsYaml } from "@/lib/resource";
import { projectSchema } from "@/lib/schemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectPage() {
  const projects = projectSchema.parse(data).projects;

  return (
    <YamlSwitch
      yaml={projectsYaml()}
      command="kubectl get projects -o yaml"
      filename="projects.yaml"
    >
      <article className="flex flex-col gap-10 py-10 sm:py-14">
        <PageHeader title="Projects" description="Some things I've built." />
        <ProjectGrid projects={projects} />
      </article>
    </YamlSwitch>
  );
}
