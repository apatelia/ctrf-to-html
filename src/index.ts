import Handlebars from "handlebars";
import fs from "node:fs";
import path from "node:path";
import { CtrfEnvironment, CtrfReport, CtrfTest, Summary, Tool } from "../types/ctrf";

interface Configuration {
  inputFile: string;
  outputFile?: string;
  reportTitle: string;
}
class CtrfHtmlReportGenerator {
  private readonly templateDir = "src/templates";
  private readonly defaultOutputDir = "ctrf";
  private inputFile: string;
  private outputFile: string;
  private title: string;
  private tool?: Tool;
  private summary?: Summary;
  private tests?: CtrfTest[];
  private environment?: CtrfEnvironment;
  private extra?: Record<string, never>;

  constructor(config: Configuration) {
    this.inputFile = path.normalize(config.inputFile);
    this.outputFile = (config.outputFile) ? path.normalize(config.outputFile) : path.resolve(this.defaultOutputDir, "ctrf-report.html");
    this.title = config.reportTitle;
  }

  generateHtmlReport (): void {
    const ctrf = this.readCtrfJsonReport();

    const results = ctrf.results;
    this.tool = results.tool;
    this.summary = results.summary;
    this.tests = results.tests;
    this.environment = results.environment;
    this.extra = results.extra;

    console.log(this.tool.name);
    console.log(this.summary);

    if (this.environment) {
      console.log(this.environment);
    }

    if (this.extra) {
      console.log(this.extra);
    }

    console.log(this.tests);

    let template: HandlebarsTemplateDelegate<unknown>;

    // Generate Summary HTML.
    template = this.readTemplateFile("summary.html");
    const startDate = new Date(this.summary.start);
    const startTime = `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`;
    const endDate = new Date(this.summary.stop);
    const endTime = `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;
    const toolName = `${this.tool.name.charAt(0).toLocaleUpperCase()}${this.tool.name.slice(1)}`;
    const summary = template(
      {
        Tool: toolName,
        TotalTests: this.summary.tests,
        PassedTests: this.summary.passed,
        FailedTests: this.summary.failed,
        SkippedTests: this.summary.skipped,
        StartTime: startTime,
        EndTime: endTime
      }
    );

    // TODO: build html string
    template = this.readTemplateFile("main.html");

    const html = template(
      {
        Title: this.title,
        Summary: summary
      }
    );

    this.writeHtmlReport(html);
  }

  readCtrfJsonReport (): CtrfReport {
    if (fs.existsSync(this.inputFile)) {
      const ctrfData = fs.readFileSync(this.inputFile, "utf-8");
      const ctrf = JSON.parse(ctrfData) as CtrfReport;

      return ctrf;
    } else {
      console.log(`CTRF Json report file "${this.inputFile}" does not exist. HTML report will not be generated. Exiting now.`);
      process.exit(-1);
    }
  }

  readTemplateFile (templateFileName: string): HandlebarsTemplateDelegate<unknown> {
    const html = fs.readFileSync(path.resolve(this.templateDir, templateFileName), "utf-8");
    return Handlebars.compile(html);
  }

  writeHtmlReport (html: string): void {
    const outputDir = path.dirname(this.outputFile);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const assetsDir = path.resolve(this.templateDir, "assets");
    fs.cpSync(assetsDir, outputDir, { recursive: true });

    fs.writeFileSync(this.outputFile, html);
  }
}

const config: Configuration = {
  inputFile: "./input/ctrf-report.json",
  outputFile: "output/report.html",
  reportTitle: "Automation Test Report"
};

const reportGenerator = new CtrfHtmlReportGenerator(config);
reportGenerator.generateHtmlReport();
