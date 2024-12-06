import fs from "node:fs";
import path from "node:path";
import Showdown, { type ShowdownOptions, type Flavor } from "showdown";
import frontmatter, { type FrontMatterResult } from "../frontmatter/index";

export type ConverterOptions = {
  mdDirectory: string;
  showdownOptions?: ShowdownOptions;
  flavor?: Flavor;
};
export type BlogPost<T> = {
  metadata: T;
  slug: string;
  converteredMd: string;
};
function getMdFiles(dir: string): string[] {
  const directory = path.join(process.cwd(), dir);
  return fs
    .readdirSync(directory)
    .filter((file) => path.extname(file) === ".md");
}

const converter = (options?: ShowdownOptions) => {
  return new Showdown.Converter(options);
};

/**
 * Converts a directory of markdown files into an array of objects containing
 * the markdown content converted to HTML, a slug, and the frontmatter metadata.
 * @param dir The directory containing the markdown files.
 * @param options The options passed to the `Showdown` converter.
 * @param flavor The flavor of the markdown being converted. Defaults to "github".
 * @returns An array of objects with the shape { metadata: T, slug: string, converteredMd: string }.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertFromDirectory<T = Record<string, any>>({
  mdDirectory,
  showdownOptions,
  flavor,
}: ConverterOptions): Array<BlogPost<T>> {
  const mdFiles = getMdFiles(mdDirectory);
  const flv: Flavor = flavor ?? "github";
  const cvt = converter(showdownOptions);
  cvt.setFlavor(flv);
  return mdFiles.map((file) => {
    const rawContent = fs.readFileSync(path.join(mdDirectory, file), "utf-8");
    const data: FrontMatterResult<T> = frontmatter(rawContent);
    const metadata: T = data.data;
    const converteredMd: string = cvt.makeHtml(data.content);
    const slug = path.basename(file, path.extname(file));
    return {
      metadata,
      slug,
      converteredMd,
    };
  });
}

export function getBlogPosts({
  mdDirectory,
  showdownOptions,
  flavor,
}: ConverterOptions) {
  return convertFromDirectory({ mdDirectory, showdownOptions, flavor });
}

export function convertFromContent(
  rawContent: string,
  showdownOptions?: ShowdownOptions,
  flavor?: Flavor,
) {
  const content = frontmatter(rawContent).content;
  const flv: Flavor = flavor ?? "github";
  const cvt = converter(showdownOptions);
  cvt.setFlavor(flv);
  return cvt.makeHtml(content);
}
