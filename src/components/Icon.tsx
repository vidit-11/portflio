import {
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  type LucideProps,
} from "lucide-react";

// Static map instead of lucide's dynamic imports, which compiles all ~1500 icons in dev.
// Add an entry here to use a new icon name in src/data/*.json.
export const icons = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  globe: Globe,
  "file-text": FileText,
};

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

export default function Icon({ name, ...props }: IconProps) {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
}
