from . import __version__ as app_version

app_name = "farben_quoting"
app_title = "Farben Quoting"
app_publisher = "Rosco Solutions"
app_description = "Farben Quoting Application"
app_icon = "octicon octicon-file-directory"
app_color = "green"
app_email = "support@rosco.solutions"
app_license = "MIT"
app_version = "1.0.0"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/farben_quoting/css/farben_quoting.css"
# app_include_js = "/assets/farben_quoting/js/farben_quoting.js"

# include js, css files in header of web template
# web_include_css = "/assets/farben_quoting/css/farben_quoting.css"
# web_include_js = "/assets/farben_quoting/js/farben_quoting.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "farben_quoting/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Quotation" : "public/js/quotation.js"}
# doctype_list_js = {"Quotes" : "public/js/quotes_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "farben_quoting.install.before_install"
# after_install = "farben_quoting.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "farben_quoting.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"farben_quoting.tasks.all"
# 	],
# 	"daily": [
# 		"farben_quoting.tasks.daily"
# 	],
# 	"hourly": [
# 		"farben_quoting.tasks.hourly"
# 	],
# 	"weekly": [
# 		"farben_quoting.tasks.weekly"
# 	]
# 	"monthly": [
# 		"farben_quoting.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "farben_quoting.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "farben_quoting.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "farben_quoting.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"farben_quoting.auth.validate"
# ]

fixtures = ["Help", 
            {"dt": "Custom Field", "filters": [["module", "like", "%Farben Quoting%"]]}
            # {"dt": "Item", "filters": [["custom_use_as_default_in_quotation", "=", "1"]]}
			]