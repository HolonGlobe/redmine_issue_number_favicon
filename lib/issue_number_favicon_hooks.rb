require 'redmine'

class IssueNumberFaviconApplicationHooks < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context = {})
    params = context[:controller].params
    html = ''

    if (params['controller'] == 'issues' and params['action'] == 'show')
      html = javascript_include_tag('issuecon.min.js', :plugin => 'redmine_issue_number_favicon')

      if File.exists?(File.join(Rails.root, 'public/plugin_assets/redmine_issue_number_favicon/javascripts/custom.js'))
        html << javascript_include_tag('custom', :plugin => 'redmine_issue_number_favicon')
      end
    end

    return html
  end
end
