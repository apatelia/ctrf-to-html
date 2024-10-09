import fs from "node:fs";
import path from "node:path";
import { CtrfReport } from "../types/ctrf";
import Handlebars from "handlebars";

export function generateHtmlReport (): void {
  const outputDir = path.normalize('output');
  const outputFileName = path.resolve(outputDir, 'report.html');

  const inputFileName = path.normalize("./input/ctrf-report.json");

  const ctrfData = fs.readFileSync(inputFileName, "utf-8");
  const ctrf = JSON.parse(ctrfData) as CtrfReport;

  const results = ctrf.results;
  const tool = `${results.tool.name.charAt(0).toLocaleUpperCase()}${results.tool.name.slice(1)}`;
  const summary = results.summary;
  const tests = results.tests;
  const environment = results.environment;
  const extra = results.extra;

  console.log(tool);
  console.log(summary);
  // console.log(environment);
  // console.log(extra);
  // console.log(tests);

  const html = fs.readFileSync(path.resolve(__dirname, "templates/main.html"), "utf-8");

  const template = Handlebars.compile(html);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(outputFileName, template({ Tool: tool }));
}

generateHtmlReport();
