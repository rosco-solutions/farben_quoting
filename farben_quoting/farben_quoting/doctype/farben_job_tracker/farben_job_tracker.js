// Copyright (c) 2025, Rosco Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Farben Job Tracker", {
     onload: function(frm) {
        // Fetch the Employee ID linked to the current user's email
        frappe.db.get_value('Employee', { user_id: frappe.session.user }, 'name', (r) => {
            if (r.name) {
                frm.set_value('employee', r.name);
            }
        });
    },
    refresh: function(frm) {
        // Hide the project link field's open button
        frm.get_field('project').$input.next('.btn-open').hide();
        
        // set start and end times to be correct size and sit next to each other.
        $(`[data-fieldname="${'start_time_hr'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%', // Set width less than 50% to prevent wrapping
            'margin-right': '3px'
        });
        $(`[data-fieldname="${'start_time_min'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%', // Set width less than 50% to prevent wrapping
            'margin-right': '3px'
        });
        $(`[data-fieldname="${'start_ampm'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%' // Set width to prevent wrapping
        });

        $(`[data-fieldname="${'end_time_hr'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%', // Set width to prevent wrapping
            'margin-right': '3px'
        });
        $(`[data-fieldname="${'end_time_min'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%', // Set width to prevent wrapping
            'margin-right': '3px'
        });
        $(`[data-fieldname="${'end_ampm'}"]`).css({
            'max-width': '75px', // Set a specific width
            'flex': '1 0 45px',  // Override flex properties if necessary
            'display': 'inline-block',
            'width': '33%' // Set width to prevent wrapping
        });
        
        // Add the custom button to the header
        frm.add_custom_button(__('Close'), function() {
            // Check if document is in Draft (0)
            if (frm.doc.docstatus === 0) {
                
                // Only save if there are unsaved changes (is_dirty)
                if (frm.is_dirty()) {
                    frm.save().then(() => {
                        frappe.show_alert({message: __('Saved and Closed'), indicator: 'green'});
                        frappe.set_route('List', 'Farben Job Tracker');
                    });
                } else {
                    // It's a draft but nothing changed, just close
                    frappe.set_route('List', 'Farben Job Tracker');
                }

            } else {
                // Scenario: Document is Submitted (1) or Cancelled (2)
                frappe.set_route('List', 'Farben Job Tracker');
            }
        });
    },
    date_worked: function(frm) {
        // Trigger the calculation when the date_worked field changes
        calculate_duration(frm);
    },
    end_time_hr: function(frm) {
        // Trigger the calculation when the end_time field changes
        if (frm.doc.end_time_hr == '12') {
            frm.set_value('end_ampm', 'PM');
        } else if (frm.doc.end_time_hr == '0') {
            frm.set_value('end_ampm', 'AM');
        }
        calculate_duration(frm);
    },
    end_time_min: function(frm) {
        // Trigger the calculation when the end_time field changes
        calculate_duration(frm);
    },
    end_ampm: function(frm) {
        calculate_duration(frm);
    },
    entry_type: function(frm) {
        if (frm.doc.entry_type == 'project') {
            frm.set_value('activity_type', 'Painting');
        } else {
            frm.set_value('activity_type', null);
            frm.set_value('project', null);
            frm.set_value('customer', null);
        } 
    },
    lunch_included: function(frm) {
        calculate_duration(frm);
    },
    start_time_hr: function(frm) {
        // Also trigger the calculation when the start_time field changes
        if (frm.doc.start_time_hr == '12') {
            frm.set_value('start_ampm', 'PM');
        } else if (frm.doc.start_time_hr == '0') {
            frm.set_value('start_ampm', 'AM');
        }
        calculate_duration(frm);
    },
    start_time_min: function(frm) {
        // Also trigger the calculation when the start_time field changes
        calculate_duration(frm);
    },
    start_ampm: function(frm) {
        calculate_duration(frm);
    },

});

function calculate_duration(frm) {
    if (frm.doc.start_time_hr && frm.doc.start_time_min && frm.doc.start_ampm && frm.doc.end_time_hr && frm.doc.end_time_min && frm.doc.end_ampm) {
        if (frm.doc.start_ampm == 'AM' || frm.doc.start_time_hr == '12') {
            var start_time = frm.doc.date_worked + ' ' + frm.doc.start_time_hr.padStart(2, '0') + ':' + frm.doc.start_time_min.padStart(2, '0') + ':00';
        } else {
            var start_time = frm.doc.date_worked + ' ' + (parseInt(frm.doc.start_time_hr, 10) + 12).toString().padStart(2, '0') + ':' + frm.doc.start_time_min.padStart(2, '0') + ':00';
        }
        if (frm.doc.end_ampm == 'AM' || frm.doc.end_time_hr == '12') {
            var end_time = frm.doc.date_worked + ' ' + frm.doc.end_time_hr.padStart(2, '0') + ':' + frm.doc.end_time_min.padStart(2, '0') + ':00';
        } else {
            var end_time = frm.doc.date_worked + ' ' + (parseInt(frm.doc.end_time_hr, 10) + 12).toString().padStart(2, '0') + ':' + frm.doc.end_time_min.padStart(2, '0') + ':00';
        }

        // Create moment objects for comparison
        var start_moment = moment(start_time); 
        var end_moment = moment(end_time); 

        // Calculate the difference in minutes or seconds as needed
        // The result will be in milliseconds, so convert it
        var duration_minutes = end_moment.diff(start_moment, 'minutes'); // Difference in minutes

        // Set the value of your duration field
        frm.set_value('duration', duration_minutes/60);
        if (frm.doc.lunch_included) {
            frm.set_value('payable_hours', (duration_minutes - 30)/60);
        } else {
            frm.set_value('payable_hours', duration_minutes/60);
        }
        if (duration_minutes < 0) {
            frappe.msgprint(__('End Time cannot be earlier than Start Time, please reselect your start or end time.'));
            // frm.set_value('end_time_hr', null);
            // frm.set_value('end_time_min', null);
            // frm.set_value('end_ampm', null);
            // frm.set_value('duration', null);
        }
    }
}
