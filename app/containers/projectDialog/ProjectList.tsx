import { NonIdealState, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";
import { useAppConfig } from "../../AppConfigContextProvider";
import { Project } from "../../redux/project/ProjectTypes";
import "./ProjectList.scss";
import { ProjectListEntry } from "./ProjectListEntry";
import { Filer } from "../../../filer/filer";

export function ProjectList() {
  const appConfig = useAppConfig();
  const [projectsLoading, setProjectsLoading] = React.useState<boolean>(true);
  const [projectFiles, setProjectFiles] = React.useState<
    Array<Project.Types.Project | string>
  >([]);
  React.useEffect(() => {
    async function loadProjects() {
      setProjectsLoading(true);
      const projectDirFiles: Filer[] = await appConfig.projectsDir.readDir();
      const filteredFiles = projectDirFiles.filter(
        (file) => file.extension === "ttmp"
      );
      const promiseArray: Array<Promise<Project.Types.Project | string>> =
        filteredFiles.map((file) => {
          return new Promise(
            (resolve: (result: Project.Types.Project | string) => void) => {
              file
                .readFile()
                .then((contents) => {
                  const project: Project.Types.Project = JSON.parse(contents);
                  resolve(project);
                })
                .catch((error) => {
                  resolve(error);
                });
            }
          );
        });
      const projects = await Promise.all(promiseArray);
      projects.sort((p1, p2) => {
        if (typeof p1 === "string" || typeof p2 === "string") {
          if (typeof p1 !== "string") {
            return -1;
          } else if (typeof p2 !== "string") {
            return 1;
          } else {
            return 0;
          }
        } else {
          return p2.lastSaved - p1.lastSaved;
        }
      });
      setProjectFiles(projects);
      setProjectsLoading(false);
    }
    loadProjects();
  }, []);
  return (
    <div className="project-list-container">
      <div className="project-list">
        {projectsLoading && <Spinner />}
        {!projectsLoading && projectFiles.length === 0 && (
          <NonIdealState
            className="no-project-details"
            icon={IconNames.MAP_CREATE}
            description="No saved projects found. Enter a map name and click create map to get started."
          />
        )}
        {!projectsLoading &&
          projectFiles.length > 0 &&
          projectFiles.map((projectOrError) => {
            if (typeof projectOrError === "string") {
              // TODO: gcole (show error)
              return null;
            } else {
              return (
                <ProjectListEntry
                  key={projectOrError.id}
                  project={projectOrError}
                />
              );
            }
          })}
      </div>
    </div>
  );
}
