// Copyright (c) 2026, Rosco Solutions

frappe.query_reports["Week Ending"] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_days(frappe.datetime.week_start(), -7),
            "reqd": 1
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_days(frappe.datetime.week_end(), -7),
            "reqd": 1
        },
        {
            "fieldname": "employee",
            "label": __("Employee"),
            "fieldtype": "Link",
            "options": "Employee"
        }
    ],

    // Explicit V15 row formatting function
    "formatter": function (value, row, column, data, default_formatter) {
        // First, apply standard formatting rules
        value = default_formatter(value, row, column, data);

        // Check if the current row's activity type is a summary row
        if (data && data.activity_type === "**WEEK TOTAL**") {
            // Intercept the final HTML output and apply direct bold typography styling
            return `<span style="font-weight: bold; color: var(--text-color);">${value}</span>`;
        }

        return value;
    }	
};
