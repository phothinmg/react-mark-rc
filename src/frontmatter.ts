import { load } from "js-yaml";

type DataProps = {
  lines: string[];
  metaIndices: number[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FrontMatterResult<T = Record<string, any>> = {
  /**
   *  Yaml data form a markdown files
   */
  data: T;
  /**
   * Body content of markdown file
   */
  content: string;
};
function findMetaIndices(mem: number[], item: string, i: number): number[] {
  // If the line starts with ---, it's a metadata delimiter
  if (/^---/.test(item)) {
    // Add the index of the line to the array of indices
    mem.push(i);
  }

  return mem;
}

function getData(linesPros: DataProps) {
  const { lines, metaIndices } = linesPros;
  if (metaIndices.length > 0) {
    const dat = lines.slice(metaIndices[0] + 1, metaIndices[1]);
    const data = load(dat.join("\n"));
    return data;
  }
  return {};
}

function getContent(linesPros: DataProps): string {
  const { lines, metaIndices } = linesPros;
  return metaIndices.length > 0
    ? lines.slice(metaIndices[1] + 1).join("\n")
    : lines.join("\n");
}

/**
 * Extracts frontmatter data from a markdown string.
 *
 * @param mdcontent A markdown string that may contain frontmatter.
 *
 * @returns An object with two properties: `data` and `content`.
 * `data` is an object containing the frontmatter data, and `content` is the
 * remainder of the markdown content.
 *
 * If the markdown string does not contain frontmatter, `data` will be an empty
 * object and `content` will contain the entire markdown string.
 *
 * @example
 * const md = `---
 * title: Example Post
 * ---
 * This is an example post.`;
 * const { data, content } = frontmatter(md);
 * // data: { title: 'Example Post' }
 * // content: 'This is an example post.'
 * @template T The type of the data object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function frontmatter<T = Record<string, any>>(
  mdcontent: string,
): FrontMatterResult<T> {
  const lines = mdcontent.split("\n");
  const metaIndices = lines.reduce(findMetaIndices, [] as number[]);
  const data = getData({ lines, metaIndices }) as T;
  const content: string = getContent({ lines, metaIndices });

  return { data, content };
}

export default frontmatter;
