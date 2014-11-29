require "stringex"
class Jekyll < Thor
    desc "new", "create a new post"
    method_option :editor, :default => "subl"
    method_option :type, :default => "draft"
    def new(*title)
        title = title.join(" ")
        date = Time.now.strftime('%Y-%m-%d')

        path = "_" + options[:type] + "s"

        filename = path + "/#{date}-#{title.to_url}.md"

        if File.exist?(filename)
            abort("#{filename} already exists!")
        end

        puts "Creating new #{options[:type]}: #{filename}"
            open(filename, 'w') do |post|
            post.puts "---"
            post.puts "layout: post"
            post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
            post.puts "date: " + Time.now.strftime("%F %T")
            post.puts "tags:"
            post.puts " -"
            post.puts "---"
        end

        system(options[:editor], filename)
    end
end
