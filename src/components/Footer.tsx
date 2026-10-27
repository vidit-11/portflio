import Socials from "./Socials";

import homeContent from "@/data/home.json";

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {homeContent.name}
          </p>
        </div>
        <Socials />
      </div>
    </footer>
  );
}
