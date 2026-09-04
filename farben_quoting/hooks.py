from . import __version__ as app_version

from erpnext.projects.doctype.timesheet.timesheet import Timesheet
from farben_quoting.api import custom_calculate_hours,  custom_set_to_time

# Monkey patch the method: Replace the original with your custom one
Timesheet.calculate_hours = custom_calculate_hours
Timesheet.set_to_time = custom_set_to_time

app_name = "farben_quoting"
app_title = "Farben Quoting"
app_publisher = "Rosco Solutions"
app_description = "Farben Quoting Application"
app_icon = "octicon octicon-file-directory"
app_color = "green"
app_email = "support@rosco.solutions"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "/assets/farben_quoting/css/farben_quoting.css"
# app_include_js = "/assets/farben_quoting/js/farben_desk_filter.js"


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
doctype_js = {
    "Quotation" : "public/js/quotation.js",
    "Timesheet": "public/js/timesheet.js"
}
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

permission_query_conditions = {
    "Communication": "farben_quoting.api.filter_private_communications"
    # "Communication": "farben_quoting.permissions.get_communication_permissions"
	# "Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
}
#
# has_permission = {
# 	 "Event": "frappe.desk.doctype.event.event.has_permission",
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

doc_events = {
    "Email Account": {
        "on_update": "farben_quoting.api.manage_email_account_permissions"
    }
}


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
            {"dt": "Custom Field", "filters": [["module", "like", "%Farben Quoting%"]]},
            {"dt": "Activity Type", "filters": [["custom_farben_job_tracker", "=", "1"]]},
            {"dt": "Module Def", "filters": [["name", "like", "%Farben%"]]},
            {"dt": "Role Profile", "filters": [["custom_rosco", "=", "1"]]},
            {"dt": "Module Profile", "filters": [["custom_rosco", "=", "1"]]},
            # {"dt": "Workspace", "filters": [["app", "in", ["frappe", "erpnext"]]]},
            {"dt": "Role", "filters": [["name", "like", "%Farben%"]]},
			]

# add_to_apps_screen = [
#     {
#         "name": "farben_employee",                      # Your exact app directory name
#         "title": "Painter",                    # The display text on the desktop grid
#         "logo": "/files/cropped-Farben-Logo-2018-PNG-1.png", # The path to your custom icon file
#         "route": "desk/farben-employee",               # The fallback routing path you verified earlier
#     },
#     {
#         "name": "farben_quoting",
#         "title": "Office",
#         "logo": "/files/cropped-Farben-Logo-2018-PNG-1.png", # Update with your preferred SVG logo
#         "route": "desk/farben-quoting",
#     }
# ]
