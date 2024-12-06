import React from "react";
import { type ShowdownOptions, type Flavor } from "showdown";
import sanitizeHtml from "sanitize-html";
import { convertFromContent } from "../markdown/index";
import "../styles/index.css";

export type MarkdownComponentProps = {
  content: string;
  showdownOptions: ShowdownOptions;
  flavor?: Flavor;
  sanitizeOptions?: sanitizeHtml.IOptions;
};
const MarkdownComponent: React.FC<MarkdownComponentProps> = ({
  content,
  showdownOptions,
  flavor,
  sanitizeOptions,
}) => {
  const convertedContent = convertFromContent(content, showdownOptions, flavor);
  const sanitizedContent = sanitizeHtml(convertedContent, sanitizeOptions);
  return (
    <section>
      <article className="prose dark:prose-invert">{sanitizedContent}</article>
    </section>
  );
};

export default MarkdownComponent;
