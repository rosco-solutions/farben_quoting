// Copyright (c) 2025, Rosco Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Farben Job Traker", {
    refresh: function(frm) {
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

    },
    end_time_hr: function(frm) {
        // Trigger the calculation when the end_time field changes
        // if (frm.doc.start_time > frm.doc.end_time) {
        //     frappe.msgprint(__('End Time cannot be earlier than Start Time'));
        //     frm.doc.end_time = null;
        //     frm.refresh_field('end_time');
        //     return;
        // }            
        calculate_duration(frm);
    },
    end_time_min: function(frm) {
        // Trigger the calculation when the end_time field changes
        // if (frm.doc.start_time > frm.doc.end_time) {
        //     frappe.msgprint(__('End Time cannot be earlier than Start Time'));
        //     frm.doc.end_time = null;
        //     frm.refresh_field('end_time');
        //     return;
        // }            
        calculate_duration(frm);
    },
    end_ampm: function(frm) {
        calculate_duration(frm);
    },
    lunch_included: function(frm) {
        calculate_duration(frm);
    },
    start_time_hr: function(frm) {
        // Also trigger the calculation when the start_time field changes
        // if (frm.doc.end_time == null) {
        //     frm.doc.end_time = frm.doc.start_time;
        //     frm.refresh_field('end_time');
        // }
        calculate_duration(frm);
    },
    start_time_min: function(frm) {
        // Also trigger the calculation when the start_time field changes
        // if (frm.doc.end_time == null) {
        //     frm.doc.end_time = frm.doc.start_time;
        //     frm.refresh_field('end_time');
        // }
        calculate_duration(frm);
    },
    start_ampm: function(frm) {
        calculate_duration(frm);
    },

});

function calculate_duration(frm) {
    if (frm.doc.start_time_hr && frm.doc.start_time_min && frm.doc.start_ampm && frm.doc.end_time_hr && frm.doc.end_time_min && frm.doc.end_ampm) {
        if (frm.doc.start_ampm == 'AM' && frm.doc.start_time_hr != '12') {
            var start_time = frm.doc.date_worked + ' ' + frm.doc.start_time_hr.padStart(2, '0') + ':' + frm.doc.start_time_min.padStart(2, '0') + ':00';
        } else {
            var start_time = frm.doc.date_worked + ' ' + (parseInt(frm.start.end_time_hr, 10) + 12).toString().padStart(2, '0') + ':' + frm.doc.start_time_min.padStart(2, '0') + ':00';
        }
        if (frm.doc.end_ampm == 'AM' && frm.doc.end_time_hr != '12') {
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
