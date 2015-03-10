# encoding: utf-8
require 'redmine'
require_dependency 'issue_number_favicon_hooks'

Redmine::Plugin.register :redmine_issue_number_favicon do
  name        'Redmine Issue Number Favicon'
  author      'Grzegorz Rajchman'
  author_url  'https://github.com/mrliptontea'
  description 'Displays issue number in favicon'
  version     '0.0.1'
end
