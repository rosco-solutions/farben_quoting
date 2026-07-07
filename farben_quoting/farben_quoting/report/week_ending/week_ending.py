# Copyright (c) 2026, Rosco Solutions


import frappe
from frappe import _
from frappe.desk.reportview import build_match_conditions


def execute(filters=None):
	if not filters:
		filters = {}
        
	# ALWAYS guarantee time keys exist to prevent SQL KeyError
	filters.setdefault("from_time", "00:00:00")
	filters.setdefault("to_time", "23:59:59") # Fixed from 24:00:00

	columns = get_column()
	conditions = get_conditions(filters)
	data = get_data(conditions, filters)

	return columns, data


def get_column():
	# Fixed format syntax from '::' to ':Type:Width' or ':Width'
	return [
		{"label": _("Name"), "fieldname": "employee_name", "fieldtype": "Data", "width": 150},
		{"label": _("Date"), "fieldname": "entry_date", "fieldtype": "Date", "width": 140},
		{"label": _("Start Time"), "fieldname": "start_time", "fieldtype": "Time", "width": 100},
		{"label": _("End Time"), "fieldname": "end_time", "fieldtype": "Time", "width": 100},
		{"label": _("Activity Type"), "fieldname": "activity_type", "fieldtype": "Link", "options": "Activity Type", "width": 120},
		{"label": _("Project"), "fieldname": "project", "fieldtype": "Link", "options": "Project", "width": 120},
		{"label": _("Project Name"), "fieldname": "project_name", "fieldtype": "Data", "width": 120},
		{"label": _("Total Time"), "fieldname": "hours", "fieldtype": "Float", "width": 100},
		{"label": _("Lunch"), "fieldname": "lunch", "fieldtype": "Check", "width": 90},
  		{"label": _("Travel"), "fieldname": "travel", "fieldtype": "Check", "width": 90},
  		{"label": _("Meal"), "fieldname": "meal", "fieldtype": "Check", "width": 90}
	]


def get_data(conditions, filters):
	time_sheet = frappe.db.sql(
		""" select 
			T.employee_name,
			DATE(TD.from_time) as entry_date, 
			TIME(TD.from_time) as start_time, 
			TIME(TD.to_time) as end_time, 
			TD.activity_type, 
			TD.project,
			P.project_name,
			TD.hours,
			TD.custom_lunch_included as lunch,
			TD.custom_travel as travel,
			TD.custom_meal as meal
		from `tabTimesheet Detail` TD
  		inner join `tabTimesheet` T on TD.parent = T.name
		left outer join `tabProject` P on TD.project = P.name
		where %s 
		order by T.name """
		% (conditions),
		filters,
		as_list=1,
	)

	return time_sheet


def get_conditions(filters):
	conditions = "T.docstatus = 1"
	if filters.get("from_date"):
		conditions += " and TD.from_time >= timestamp(%(from_date)s, %(from_time)s)"
	if filters.get("to_date"):
		conditions += " and TD.to_time <= timestamp(%(to_date)s, %(to_time)s)"

	match_conditions = build_match_conditions("Timesheet")
	if match_conditions:
		conditions += " and %s" % match_conditions

	return conditions
