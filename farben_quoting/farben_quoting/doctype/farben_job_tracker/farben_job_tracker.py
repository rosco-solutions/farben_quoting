import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime, getdate, add_days
import datetime
from datetime import datetime

class FarbenJobTracker(Document):
	def on_submit(self):
		# Call the helper function to create the timesheet
		self.create_linked_timesheet()

	def create_linked_timesheet(self):
		# See if a Timesheet already exists for this job tracker entry
		# 1. Ensure date_worked is a date object
		date_worked = getdate(self.date_worked)
		# 2. Find Monday before (or on) date_worked
		monday_before = add_days(date_worked, -date_worked.weekday()) # weekday() returns 0 for Monday, 6 for Sunday
		# 3. Find Sunday after (or on) date_worked
		sunday_after = add_days(monday_before, 6) # Since Monday is 0, Sunday of the same week is Monday + 6 days

		timesheet_name = frappe.db.get_value("Timesheet", 
			filters={
				"employee": self.employee,
				"docstatus": 0,  # 0 = Draft
				"start_date": ["<=", sunday_after],
				"end_date": [">=", monday_before]
			}, 
			fieldname="name"
		)
		if timesheet_name:
			new_timesheet = False
			timesheet = frappe.get_doc("Timesheet", timesheet_name)
		else:
			new_timesheet = True
			# Create new Timesheet 
			timesheet = frappe.get_doc({
				"doctype": "Timesheet",
				"employee": self.employee,
				"company": 'Farben',  # Adjust as necessary
				"status": "Draft",
				"note": f"Generated from {self.doctype} {self.name}"
			})

		# 2. Append the time entry to the child table 'time_logs'
		time_str = f"{self.start_time_hr}:{self.start_time_min} {self.start_ampm}"
		time_obj = datetime.strptime(time_str, "%I:%M %p").time() # %I is 12-hour clock, %M is minutes, %p is AM/PM
		date_worked = getdate(self.date_worked)
		start_datetime = datetime.combine(date_worked, time_obj)
		time_str = f"{self.end_time_hr}:{self.end_time_min} {self.end_ampm}"
		time_obj = datetime.strptime(time_str, "%I:%M %p").time() # %I is 12-hour clock, %M is minutes, %p is AM/PM
		end_datetime = datetime.combine(date_worked, time_obj)
  
		timesheet.append("time_logs", {
			"activity_type": self.activity_type or "Painting",
			"from_time": start_datetime,
			"to_time": end_datetime,
			"hours": self.payable_hours,
			"project": self.project,
			"custom_lunch_included": self.lunch_included,
			"custom_travel": self.travel,
			"custom_meal": self.meal,
			"description": f"Automated entry for {self.name}"
		})

		# 3. Save the Timesheet
		if new_timesheet:
			timesheet.insert(ignore_permissions=True)
			# frappe.msgprint(f"Timesheet <a href='/app/timesheet/{timesheet.name}'>{timesheet.name}</a> has been created.")
		else:
			timesheet.save(ignore_permissions=True)
			# frappe.msgprint(f"Timesheet <a href='/app/timesheet/{timesheet.name}'>{timesheet.name}</a> has been updated.")

