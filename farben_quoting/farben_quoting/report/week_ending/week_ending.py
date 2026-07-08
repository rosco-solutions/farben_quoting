# Copyright (c) 2026, Rosco Solutions


import frappe
from frappe import _
from collections import defaultdict
from datetime import datetime

def execute(filters=None):
    if not filters:
        filters = {}
        
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": _("Employee Name"), "fieldname": "employee_name", "fieldtype": "Data", "width": 160},
        {"label": _("Project Name"), "fieldname": "project_name", "fieldtype": "Data", "width": 180},
        {"label": _("Employee / Date"), "fieldname": "employee_date", "fieldtype": "Data", "width": 140},
        {"label": _("Start"), "fieldname": "start_time", "fieldtype": "Time", "width": 80},
        {"label": _("Finish"), "fieldname": "finish_time", "fieldtype": "Time", "width": 80},
        {"label": _("Lunch"), "fieldname": "lunch", "fieldtype": "Check", "width": 70},
        {"label": _("Travel"), "fieldname": "travel", "fieldtype": "Check", "width": 70},
        {"label": _("Meal"), "fieldname": "meal", "fieldtype": "Check", "width": 70},
        {"label": _("Timesheet"), "fieldname": "timesheet", "fieldtype": "Link", "options": "Timesheet", "width": 140},
        {"label": _("Activity Type"), "fieldname": "activity_type", "fieldtype": "Data", "width": 130},
        {"label": _("Standard Hours"), "fieldname": "standard_hours", "fieldtype": "Float", "width": 110},
        {"label": _("Painting 1.5 Hours"), "fieldname": "painting_15_hours", "fieldtype": "Float", "width": 130},
        {"label": _("Painting 2.0 Hours"), "fieldname": "painting_20_hours", "fieldtype": "Float", "width": 130},
        {"label": _("Total Hours"), "fieldname": "total_hours", "fieldtype": "Float", "width": 110}
    ]

def get_data(filters):
    conditions = "where t.docstatus = 1"
    
    if filters.get("from_date"):
        conditions += " and td.from_time >= %(from_date)s"
    if filters.get("to_date"):
        conditions += " and td.from_time <= %(to_date)s"
    if filters.get("employee"):
        conditions += " and t.employee = %(employee)s"

    raw_records = frappe.db.sql(f"""
        select 
            t.employee,
            t.employee_name,
            t.name as timesheet,
            td.project_name,
            td.from_time,
            td.to_time,
            td.activity_type,
            td.hours,
            td.custom_lunch_included,
            td.custom_travel,
            td.custom_meal
        from `tabTimesheet Detail` td
        join `tabTimesheet` t on td.parent = t.name
        {conditions}
        order by t.employee, td.from_time
    """, filters, as_dict=1)

    grouped_data = defaultdict(list)
    for row in raw_records:
        if not row['from_time']:
            continue
            
        date_obj = row['from_time'] if isinstance(row['from_time'], datetime) else datetime.strptime(str(row['from_time']), '%Y-%m-%d %H:%M:%S')
        year_week = date_obj.strftime('%Y-W%W') 
        
        group_key = (row['employee'], row['employee_name'], year_week)
        grouped_data[group_key].append(row)

    report_data = []

    for group_key, records in grouped_data.items():
        emp_id, emp_name, week = group_key
        
        week_std = 0.0
        week_p15 = 0.0
        week_p20 = 0.0
        week_total = 0.0
        
        detail_rows = []

        for rec in records:
            hours = float(rec['hours'] or 0)
            act_type = str(rec['activity_type'] or "").strip()
            act_type_clean = act_type.lower()
            
            std_h, p15_h, p20_h = 0.0, 0.0, 0.0
            
            if "painting 1.5" in act_type_clean:
                p15_h = hours
                week_p15 += hours
            elif "painting 2.0" in act_type_clean:
                p20_h = hours
                week_p20 += hours
            else:
                std_h = hours
                week_std += hours
                
            week_total += hours

            # Formatting raw date/time fields cleanly
            start_dt = rec['from_time']
            end_dt = rec['to_time']
            
            start_time_str = start_dt.strftime('%H:%M:%S') if isinstance(start_dt, datetime) else str(start_dt)[11:19]
            finish_time_str = end_dt.strftime('%H:%M:%S') if isinstance(end_dt, datetime) else str(end_dt)[11:19]

            detail_rows.append({
                "employee_date": start_dt.strftime('%Y-%m-%d') if isinstance(start_dt, datetime) else str(start_dt)[:10],
                "employee_name": emp_name,
                "timesheet": rec['timesheet'],
                "project_name": rec['project_name'],
                "start_time": start_time_str,
                "finish_time": finish_time_str,
                "activity_type": act_type,
                "lunch": rec['custom_lunch_included'],
                "travel": rec['custom_travel'],
                "meal": rec['custom_meal'],
                "standard_hours": std_h,
                "painting_15_hours": p15_h,
                "painting_20_hours": p20_h,
                "total_hours": hours,
                "indent": 1
            })

        # Inject Week Summary block header
        report_data.append({
            "employee_date": f"**{week}**",
            "employee_name": f"**{emp_name}**",
            "timesheet": "",
            "project_name": "",
            "start_time": "",
            "finish_time": "",
            "activity_type": "**WEEK TOTAL**",
            "lunch": 0,
            "travel": 0,
            "meal": 0,
            "standard_hours": week_std,
            "painting_15_hours": week_p15,
            "painting_20_hours": week_p20,
            "total_hours": week_total,
            "indent": 0
        })
        
        report_data.extend(detail_rows)
        report_data.append({}) # Break spacer line

    return report_data
