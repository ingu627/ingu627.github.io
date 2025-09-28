#!/usr/bin/env ruby
# Simple Jekyll front matter audit for missing or overly long/short excerpts.
# Usage: ruby Rakefile_seo_excerpt_audit.rb (can be integrated into main Rakefile later)

require 'yaml'
require 'pathname'

ROOT = Pathname.new(File.dirname(__FILE__))
POST_DIR = ROOT.join('_posts')

THRESHOLDS = { min: 60, max: 140 }

def extract_front_matter(path)
  content = File.read(path)
  return nil unless content.start_with?('---')
  parts = content.split(/^---\s*$\n/)
  # parts[1] should contain YAML front matter
  yaml_block = parts[1]
  YAML.safe_load(yaml_block)
rescue Psych::SyntaxError
  warn "YAML parse error: #{path}"
  nil
end

def audit
  issues = []
  Dir.glob(POST_DIR.join('**/*.md')).sort.each do |file|
    fm = extract_front_matter(file)
    next unless fm
    excerpt = fm['excerpt'] || fm['excerpt ']
    if excerpt.nil? || excerpt.to_s.strip.empty?
      issues << [file, 'MISSING', 0]
      next
    end
    length = excerpt.gsub(/<br\/?\s*>/, '').strip.size
    if length < THRESHOLDS[:min]
      issues << [file, 'SHORT', length]
    elsif length > THRESHOLDS[:max]
      issues << [file, 'LONG', length]
    end
  end
  puts "Excerpt Audit Report (min=#{THRESHOLDS[:min]}, max=#{THRESHOLDS[:max]})"
  puts 'Status | Length | File'
  issues.each do |f, status, len|
    puts sprintf('%-7s | %5d | %s', status, len, Pathname.new(f).relative_path_from(ROOT))
  end
  puts "\nTotal posts scanned: #{Dir.glob(POST_DIR.join('**/*.md')).count}"
  puts "Issues found: #{issues.count}"
end

audit if __FILE__ == $0
