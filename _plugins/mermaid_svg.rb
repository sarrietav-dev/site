# frozen_string_literal: true

require "cgi"
require "digest"
require "fileutils"
require "json"
require "open3"
require "tmpdir"

# Pre-renders ```mermaid code blocks to inline SVG at build time so diagrams
# work without client-side JavaScript. Two SVGs are produced per diagram (a
# light and a dark variant using the Flexoki palette); CSS in main.scss shows
# the one that matches the reader's color scheme. Rendered SVGs are cached on
# disk by content hash so unchanged diagrams are not re-rendered.
module MermaidSvg
  CACHE_DIR = File.join(Dir.pwd, ".mermaid-cache")

  # Bump when the theme config or post-processing below changes so stale
  # cached SVGs are regenerated.
  RENDER_VERSION = "1"

  FONT_FAMILY =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

  # Mirrors the theme variables the old client-side renderer used
  # (_includes/mermaid.html), keyed by color scheme.
  THEMES = {
    "light" => {
      "theme" => "base",
      "fontFamily" => FONT_FAMILY,
      "themeVariables" => {
        "darkMode" => false,
        "primaryColor" => "#F2F0E5",       # flexoki-50
        "primaryBorderColor" => "#205EA6", # blue-600
        "primaryTextColor" => "#100F0F",   # black
        "secondaryColor" => "#E6E4D9",     # flexoki-100
        "tertiaryColor" => "#F2F0E5",
        "lineColor" => "#6F6E69",          # flexoki-600
        "textColor" => "#100F0F"
      }
    },
    "dark" => {
      "theme" => "base",
      "fontFamily" => FONT_FAMILY,
      "themeVariables" => {
        "darkMode" => true,
        "primaryColor" => "#1C1B1A",       # flexoki-950
        "primaryBorderColor" => "#4385BE", # blue-400
        "primaryTextColor" => "#CECDC3",   # flexoki-200
        "secondaryColor" => "#282726",     # flexoki-900
        "tertiaryColor" => "#1C1B1A",
        "lineColor" => "#878580",          # flexoki-500
        "textColor" => "#CECDC3"
      }
    }
  }.freeze

  # Kramdown renders a ```mermaid fence as <pre><code class="language-mermaid">.
  BLOCK = %r{<pre><code class="language-mermaid">(.*?)</code></pre>}m

  module_function

  def convert(content)
    return content unless content.include?('class="language-mermaid"')

    content.gsub(BLOCK) do
      source = CGI.unescapeHTML(Regexp.last_match(1)).strip
      figure(source, Regexp.last_match(0))
    end
  end

  def figure(source, original)
    light = render(source, "light")
    dark = render(source, "dark")

    # If rendering fails, leave the original code block untouched rather than
    # dropping the diagram entirely.
    return original if light.nil? || dark.nil?

    # The dark variant carries an inline display:none so contexts that ignore
    # the stylesheet (RSS readers) show only the light variant instead of both
    # stacked; main.scss flips this with !important under a dark color scheme.
    <<~HTML.strip
      <figure class="mermaid-figure">
        <div class="mermaid-diagram mermaid-light">#{light}</div>
        <div class="mermaid-diagram mermaid-dark" style="display:none">#{dark}</div>
      </figure>
    HTML
  end

  def render(source, theme)
    key = Digest::SHA1.hexdigest([RENDER_VERSION, theme, source].join("\0"))
    cache_path = File.join(CACHE_DIR, "#{key}.svg")
    return File.read(cache_path, encoding: "UTF-8") if File.exist?(cache_path)

    svg = run_mmdc(source, theme, "m#{key[0, 12]}")
    return nil if svg.nil?

    svg = postprocess(svg)
    FileUtils.mkdir_p(CACHE_DIR)
    File.write(cache_path, svg)
    svg
  end

  def run_mmdc(source, theme, svg_id)
    Dir.mktmpdir("mermaid") do |dir|
      input = File.join(dir, "in.mmd")
      output = File.join(dir, "out.svg")
      config = File.join(dir, "config.json")
      puppeteer = File.join(dir, "puppeteer.json")

      File.write(input, source)
      File.write(config, JSON.generate(THEMES.fetch(theme)))
      File.write(puppeteer, JSON.generate("args" => ["--no-sandbox"]))

      cmd = mmdc_cmd + [
        "-i", input,
        "-o", output,
        "-c", config,
        "-p", puppeteer,
        "-b", "transparent",
        "-I", svg_id
      ]

      _out, err, status = Open3.capture3(*cmd)
      unless status.success? && File.exist?(output)
        Jekyll.logger.error "Mermaid:",
                            "render failed (#{theme}): #{err.strip[0, 500]}"
        return nil
      end

      File.read(output, encoding: "UTF-8")
    end
  end

  # Prefer a locally installed mmdc; fall back to fetching via npx.
  def mmdc_cmd
    local = File.join(Dir.pwd, "node_modules", ".bin", "mmdc")
    File.exist?(local) ? [local] : ["npx", "--yes", "@mermaid-js/mermaid-cli"]
  end

  def postprocess(svg)
    # Strip the XML prolog / doctype so the SVG inlines cleanly into HTML.
    svg = svg.sub(/\A.*?(?=<svg)/m, "")
    # Drop the baked-in inline size so CSS (max-width/height:auto) controls it;
    # the viewBox is preserved for correct scaling.
    svg.sub(/(<svg\b[^>]*?)\s+style="[^"]*"/, '\1')
  end
end

Jekyll::Hooks.register [:pages, :posts], :post_convert do |document|
  document.content = MermaidSvg.convert(document.content)
end
