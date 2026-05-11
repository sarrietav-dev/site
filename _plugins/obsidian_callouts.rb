# frozen_string_literal: true

module ObsidianCallouts
  CALLOUT_ALIASES = {
    "summary" => "abstract",
    "tldr" => "abstract",
    "hint" => "tip",
    "important" => "tip",
    "check" => "success",
    "done" => "success",
    "help" => "question",
    "faq" => "question",
    "caution" => "warning",
    "attention" => "warning",
    "fail" => "failure",
    "missing" => "failure",
    "error" => "danger",
    "cite" => "quote"
  }.freeze

  BLOCKQUOTE = %r{<blockquote>((?:(?!<blockquote>).)*?)</blockquote>}m.freeze
  CALLOUT_START = %r{\A\s*<p>\[!([a-zA-Z][\w-]*)\]([+-])?(?:[ \t]*(.*?))?(\n|</p>)}m.freeze
  NESTED_CALLOUT = /\A((?:>\s*)+)(\[![a-zA-Z][\w-]*\][+-]?)/.freeze

  module_function

  def convert(content)
    previous = nil

    while previous != content
      previous = content
      content = content.gsub(BLOCKQUOTE) { convert_blockquote(Regexp.last_match(1), Regexp.last_match(0)) }
    end

    content
  end

  def normalize(markdown)
    previous_depth = 0

    markdown.lines.each_with_object([]) do |line, lines|
      match = line.match(NESTED_CALLOUT)
      depth = match ? match[1].count(">") : quote_depth(line)

      if match && depth > previous_depth && previous_depth.positive?
        lines << "#{([">"] * previous_depth).join(" ")}\n"
      end

      lines << line
      previous_depth = depth
    end.join
  end

  def quote_depth(line)
    match = line.match(/\A((?:>\s*)+)/)
    match ? match[1].count(">") : 0
  end

  def convert_blockquote(inner_html, original_html)
    match = inner_html.match(CALLOUT_START)
    return original_html unless match

    requested_type = match[1].downcase
    fold_marker = match[2]
    title = match[3].to_s.strip
    type = CALLOUT_ALIASES.fetch(requested_type, requested_type)
    title = title.empty? ? type.split("-").map(&:capitalize).join(" ") : title
    content_html = inner_html.sub(CALLOUT_START, "")
    content_html = "<p>#{content_html}" if match[4] == "\n"
    content_html = content_html.strip

    classes = ["callout", "callout-#{type}"]
    classes << "is-foldable" if fold_marker

    return foldable_callout(classes, type, requested_type, title, content_html, fold_marker == "+") if fold_marker

    <<~HTML.strip
      <aside class="#{classes.join(" ")}" data-callout="#{type}" data-callout-source="#{requested_type}">
        <div class="callout-title">
          <span class="callout-icon" aria-hidden="true"></span>
          <span class="callout-title-text">#{title}</span>
        </div>
        #{callout_content(content_html)}
      </aside>
    HTML
  end

  def foldable_callout(classes, type, requested_type, title, content_html, open)
    open_attribute = open ? " open" : ""

    <<~HTML.strip
      <details class="#{classes.join(" ")}" data-callout="#{type}" data-callout-source="#{requested_type}"#{open_attribute}>
        <summary class="callout-title">
          <span class="callout-icon" aria-hidden="true"></span>
          <span class="callout-title-text">#{title}</span>
        </summary>
        #{callout_content(content_html)}
      </details>
    HTML
  end

  def callout_content(content_html)
    return "" if content_html.empty?

    <<~HTML.strip
      <div class="callout-content">
        #{content_html}
      </div>
    HTML
  end
end

Jekyll::Hooks.register [:pages, :posts], :pre_render do |document|
  document.content = ObsidianCallouts.normalize(document.content)
end

Jekyll::Hooks.register [:pages, :posts], :post_convert do |document|
  document.content = ObsidianCallouts.convert(document.content)
end
