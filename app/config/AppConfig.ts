import { checkNotNull } from "../utils/check";
import { Filer } from "../../filer/filer";

export const AppConfigFiles = {
  appConfigFilename: "appConfig.json",
  assetDirname: "_assets",
  assetDataFilename: "assets.json",
  projectsDirname: "_project",
};

export interface SerializedAppConfig {
  appVersion: string;
  rootDir: string;
  assetDir: string;
  assetDataFile: string;
  projectsDir: string;
}

export interface AppConfig {
  appVersion: string;
  rootDir: Filer;
  assetDir: Filer;
  assetDataFile: Filer;
  projectsDir: Filer;
  getAssetFileById: (id: string, extension: string) => Filer;
}

function generateAssetFileGetter(assetDir: Filer) {
  return (id: string, extension: string): Filer => {
    const index = id.slice(0, 2);
    return assetDir.resolve(index).resolve(id + "." + extension);
  };
}

export function createNewAppConfig(rootDir: Filer, version: string): AppConfig {
  const assetDir = rootDir.resolve(AppConfigFiles.assetDirname);
  return {
    appVersion: version,
    rootDir: rootDir,
    assetDir,
    assetDataFile: rootDir.resolve(AppConfigFiles.assetDataFilename),
    projectsDir: rootDir.resolve(AppConfigFiles.projectsDirname),
    getAssetFileById: generateAssetFileGetter(assetDir),
  };
}

export async function readAppConfig(configFile: Filer) {
  const contents = await configFile.readFile();
  const rawConfig: SerializedAppConfig = JSON.parse(contents);
  const assetDir = Filer.open(checkNotNull(rawConfig.assetDir, "assetDir"));
  const parsedConfig: AppConfig = {
    appVersion: checkNotNull(rawConfig.appVersion, "appVersion"),
    rootDir: Filer.open(checkNotNull(rawConfig.rootDir, "appVersion")),
    assetDir,
    assetDataFile: Filer.open(
      checkNotNull(rawConfig.assetDataFile, "assetDataFile")
    ),
    projectsDir: Filer.open(checkNotNull(rawConfig.projectsDir, "projectsDir")),
    getAssetFileById: generateAssetFileGetter(assetDir),
  };
  return parsedConfig;
}

export async function writeAppConfig(configFile: Filer, appConfig: AppConfig) {
  const serializedConfig: SerializedAppConfig = {
    appVersion: appConfig.appVersion,
    rootDir: appConfig.rootDir.fullPath,
    assetDir: appConfig.assetDir.fullPath,
    assetDataFile: appConfig.assetDataFile.fullPath,
    projectsDir: appConfig.projectsDir.fullPath,
  };
  const rawConfig = JSON.stringify(serializedConfig);
  await configFile.writeFile(rawConfig);
}

export function getProjectFile(appConfig: AppConfig, projectId: string) {
  return appConfig.projectsDir.resolve(projectId + ".ttmp");
}
export function getProjectDataFile(appConfig: AppConfig, projectId: string) {
  return appConfig.projectsDir.resolve(projectId + ".data");
}
