frappe.ui.form.on('Timesheet Detail', {
    // This handles BOTH the custom checkbox and the standard time fields
    custom_lunch_included: function(frm, cdt, cdn) {
        recalculate_with_lock(frm, cdt, cdn);
    },
    from_time: function(frm, cdt, cdn) {
        recalculate_with_lock(frm, cdt, cdn);
    },
    to_time: function(frm, cdt, cdn) {
        recalculate_with_lock(frm, cdt, cdn);
    },
    hours: function(frm, cdt, cdn) {
        if (frm._setting_hours) {
            return; // Exit if this change was programmatic
        }
        calculate_end_time(frm, cdt, cdn, true);
    }
});

function recalculate_with_lock(frm, cdt, cdn) {
    if (frm._silence_hours_trigger) {
        return; // Exit if already in a recalculation cycle
    }

    let row = locals[cdt][cdn];
    
    if (row.from_time && row.to_time) {
        // 1. Calculate duration using moment for accuracy
        let start = moment(row.from_time);
        let end = moment(row.to_time);
        let duration_minutes = end.diff(start, 'minutes');

        // 2. Determine net hours
        let total_hours = duration_minutes / 60.0;
        let final_hours = row.custom_lunch_included ? (total_hours - 0.5) : total_hours;
        final_hours = Math.max(0, final_hours);

        // 3. SET THE LOCK
        frm._silence_hours_trigger = true;

        try {
            // 4. Update the hours field (this WILL trigger 'hours' event above)
            frm._setting_hours = true; // Optional: flag to indicate programmatic change and stop seting the To Time again
            frappe.model.set_value(cdt, cdn, 'hours', final_hours);

            // Refresh parent totals
            frm.refresh_field('time_logs');
            frm.trigger('calculate_total_working_hours');

        } finally {
            // 6. RELEASE THE LOCK after a short delay to ensure browser cycle finishes
            setTimeout(() => {
                frm._silence_hours_trigger = false;
                frm._setting_hours = false;
            }, 50);
        }
    }
}

var calculate_end_time = function (frm, cdt, cdn, force) {
    if (frm._silence_hours_trigger && !force) {
        return; // was triggered by change in custom field, do not proceed
    }
 
    let child = locals[cdt][cdn];

	if (!child.from_time) {
		// if from_time value is not available then set the current datetime
		frappe.model.set_value(cdt, cdn, "from_time", frappe.datetime.get_datetime_as_string());
	}

	let d = moment(child.from_time);
	if (child.hours) {
		if (child.custom_lunch_included) {
			d.add(child.hours + 0.5, "hours");
		} else {
			d.add(child.hours, "hours");
		}   
		frm._setting_hours = true;
		frappe.model.set_value(cdt, cdn, "to_time", d.format(frappe.defaultDatetimeFormat)).then(() => {
			frm._setting_hours = false;
		});
	}
};