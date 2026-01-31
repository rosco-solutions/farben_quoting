import frappe
from frappe.utils import time_diff_in_hours, add_to_date, get_datetime, time_diff_in_seconds

# Custom Timesheet Methods to include lunch deduction logic. These override the standard methods 
# found in erpnext.projects.doctype.timesheet.timesheet

def custom_calculate_hours(self):
    """Replaces the standard Timesheet.calculate_hours method"""
    for row in self.time_logs:
        if row.to_time and row.from_time:
            # Standard duration
            duration = time_diff_in_hours(row.to_time, row.from_time)
            
            # Apply your custom lunch deduction logic
            if getattr(row, "custom_lunch_included", None):
                row.hours = max(0, duration - 0.5)
            else:
                row.hours = duration

def custom_set_to_time(self, data):
    """
    Overrides set_to_time to account for lunch deduction.
    If lunch is included, we add 0.5 hours back to the 'hours' 
    provided to calculate the correct 'to_time'.
    """
    if not (data.from_time and data.hours):
        return

    # Calculate actual hours to add (Gross hours)
    hours_to_add = data.hours
    if getattr(data, "custom_lunch_included", None):
        hours_to_add = data.hours + 0.5

    # Calculate the new to_time
    _to_time = get_datetime(add_to_date(data.from_time, hours=hours_to_add, as_datetime=True))

    # Update only if the difference is significant (>= 1 second)
    if not data.to_time or abs(time_diff_in_seconds(_to_time, data.to_time)) >= 1:
        data.to_time = _to_time