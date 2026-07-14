require 'httparty'
require 'jekyll'
require 'nokogiri'

# Reads the latest uploads from a channel's public RSS feed at build time and
# exposes them as site.data['youtube_videos']. No API key needed; the trade-off
# is that the feed only ever carries the 15 most recent uploads.
module YouTubeVideos
  class YouTubeVideosGenerator < Jekyll::Generator
    safe true
    priority :high

    FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=%s'.freeze

    def generate(site)
      channel_id = site.config['youtube_channel_id']
      return if channel_id.nil? || channel_id.to_s.strip.empty?

      site.data['youtube_videos'] = fetch(channel_id)
    end

    private

    def fetch(channel_id)
      puts "Fetching YouTube videos for channel #{channel_id}:"
      response = HTTParty.get(format(FEED_URL, channel_id), timeout: 20)

      unless response.success?
        warn_and_skip("feed returned HTTP #{response.code}")
        return []
      end

      doc = Nokogiri::XML(response.body)
      doc.remove_namespaces!

      videos = doc.xpath('//entry').map do |entry|
        {
          'id' => entry.at_xpath('videoId')&.text,
          'title' => entry.at_xpath('title')&.text,
          'url' => entry.at_xpath('link')&.attr('href'),
          'published' => entry.at_xpath('published')&.text,
          'thumbnail' => entry.at_xpath('group/thumbnail')&.attr('url'),
        }
      end

      videos = videos.reject { |video| video['id'].nil? || video['id'].empty? }
      videos = videos.sort_by { |video| video['published'].to_s }.reverse
      puts "...found #{videos.size} video(s)"
      videos
    rescue StandardError => e
      # A flaky network on the build machine must not take the whole site down.
      warn_and_skip(e.message)
      []
    end

    def warn_and_skip(reason)
      Jekyll.logger.warn 'YouTube:', "could not fetch feed (#{reason}); video section will be empty"
    end
  end
end
