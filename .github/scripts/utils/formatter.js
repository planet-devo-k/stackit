/**
 * 이슈 템플릿의 YAML Frontmatter(--- ... ---) 구역을 제거합니다.
 */
export const removeYamlFrontmatter = (text) => {
  return text.replace(/^---[\s\S]*?---/, "").trim();
};

/**
 * 템플릿 내의 {{key}} 형태의 플레이스홀더를 실제 데이터로 치환합니다.
 */
export const replacePlaceholders = (template, data) => {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, value);
  });
  return result;
};

/**
 * 데이터를 바탕으로 마크다운 표를 생성합니다.
 * @param {Array} data - 테이블에 표시할 데이터 배열
 * @param {Object} config - 테이블 설정 (headers, renderRow)
 */
export const createMarkdownTable = (data, { headers, renderRow }) => {
  const headerStr = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map((_, i) => (i === 0 ? ":---" : ":---:")).join(" | ")} |`;

  const rows = data
    .map((id) => {
      const rowObj = renderRow(id);
      const values = Object.values(rowObj);
      return `| ${values.join(" | ")} |`;
    })
    .join("\n");

  return `${headerStr}\n${divider}\n${rows}`;
};

/**
 * Discord용 (고정 너비 코드 블록 표)
 */
export const createDiscordTable = (
  data,
  { headers, paddings = [], renderRow },
) => {
  const getVisualWidth = (str) => {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
      width += str.charCodeAt(i) > 0x007f ? 2 : 1;
    }
    return width;
  };

  const headerStr = headers
    .map((h, i) => {
      const targetWidth = paddings[i] || 10;
      const text = h.trim();
      const currentWidth = getVisualWidth(text);
      return (
        " " + text + " ".repeat(Math.max(0, targetWidth - currentWidth - 1))
      );
    })
    .join("|");

  const divider = paddings.map((p) => "-".repeat(p)).join("|");

  const rows = data
    .map((id) => {
      const rowObj = renderRow(id);
      const values = Object.values(rowObj);

      return values
        .map((val, i) => {
          const str = String(val);
          if (i === 0) return " " + str.padEnd(4, " ");
          if (i === 1) return "   " + str + "   ";
          if (i === 2) return " " + str.padEnd(5, " ");

          const targetWidth = paddings[i] || 10;
          const currentWidth = getVisualWidth(str);
          return (
            " " + str + " ".repeat(Math.max(0, targetWidth - currentWidth - 1))
          );
        })
        .join("|");
    })
    .join("\n");

  return `\`\`\`\n${headerStr}\n${divider}\n${rows}\n\`\`\``;
};
