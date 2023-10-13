import hljs from 'highlight.js/lib/common';
import { type HTMLProps, useMemo } from 'react';

type FormattedArticleProps = HTMLProps<HTMLDivElement> & {
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

const useHighlightCodeBlocks = (html: string) => {
    return useMemo(() => {
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
};

const useYoutubeEmbeds = (html: string) => {
    return useMemo(() => {
        // Youtube video URL regex
        // e.g. <a href="https://www.youtube.com/watch?v=QH2-TGUlwu4">test</a>
        // e.g. <a href="https://youtu.be/QH2-TGUlwu4">Something</a>
        const youtubeRegex =
            /<a .*?href="(?:https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([a-zA-Z0-9_-]+).*?">.*?<\/a>/g;

        const matches = [...html.matchAll(youtubeRegex)];
        let formattedHtml = html;
        for (const match of matches) {
            const [fullMatch, videoId] = match;
            formattedHtml = formattedHtml.replace(
                fullMatch,
                `<iframe class="youtube-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            );
        }
        return formattedHtml;
    }, [html]);
};

export const FormattedArticle = ({ html, ...props }: FormattedArticleProps) => {
    const highlightedHtml = useHighlightCodeBlocks(html);
    const youtubeHtml = useYoutubeEmbeds(highlightedHtml);

    return <div dangerouslySetInnerHTML={{ __html: youtubeHtml }} {...props} />;
};
