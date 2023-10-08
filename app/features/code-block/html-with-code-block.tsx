import hljs from 'highlight.js/lib/common';
import { type HTMLProps, useMemo } from 'react';

type HtmlWithCodeBlockProps = HTMLProps<HTMLDivElement> & {
    html: string;
};

const decodeHtml = (html: string) => {
    return html
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&#39;', "'")
        .replaceAll('&quot;', '"');
};

export const HtmlWithCodeBlock = ({
    html,
    ...props
}: HtmlWithCodeBlockProps) => {
    const formattedHtml = useMemo(() => {
        const codeBlockRegex =
            /<pre><code class="language-([a-z]+)">([\s\S]+?)<\/code><\/pre>/g;
        const inlineCodeRegex = /<code>([\s\S]+?)<\/code>/g;
        const matches = [...html.matchAll(codeBlockRegex)];

        let formattedHtml = html;
        for (const match of matches) {
            const [fullMatch, language, code] = match;
            const highlightedCode = hljs.highlight(decodeHtml(code), {
                language,
            }).value;
            formattedHtml = formattedHtml.replace(
                fullMatch,
                `<pre><code class="language-${language}">${highlightedCode}</code></pre>`,
            );
        }

        const inlineMatches = [...formattedHtml.matchAll(inlineCodeRegex)];
        for (const match of inlineMatches) {
            const [fullMatch, code] = match;
            const highlightedCode = hljs.highlightAuto(decodeHtml(code));
            formattedHtml = formattedHtml.replace(
                fullMatch,
                `<code class="language-${highlightedCode.language}">${highlightedCode.value}</code>`,
            );
        }

        return formattedHtml;
    }, [html]);
    return (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} {...props} />
    );
};
