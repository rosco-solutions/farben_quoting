var job_type_timeout;

frappe.ui.form.on("Quotation", {
	refresh: function(frm) {
		if (frm.doc.items.length == 1){
			frappe.db.get_list('Item', {
				fields: ['item_code', 'item_name', 'stock_uom', 'description', 'custom_item_sequence'],
				filters: {'custom_use_as_default_in_quotation': 1},
				order_by: 'custom_item_sequence asc'
			}).then(records => {
				if (records.length > 0) {

					for (var i = 0; i < records.length; i++) {
						if (frm.doc.items[i] && !frm.doc.items[i].item_code){
							frm.doc.items[i].item_code = records[i].item_code;
							frm.doc.items[i].item_name = records[i].item_name;
							frm.doc.items[i].uom = records[i].stock_uom;
							frm.doc.items[i].description = records[i].description;
							frm.doc.items[i].qty = 1;
							frm.doc.items[i].rate = 0; // Reset rate to 0
						} else {
							frm.add_child('items', {
								item_code: records[i].item_code,
								item_name: records[i].item_name,
								uom: records[i].stock_uom,
								description: records[i].description,
								qty: 1,
								rate: 0 // Reset rate to 0
							});
						}	
					}
					frm.refresh_field('items');
				}
			})
		}
	},
    custom_job_type: function(frm) {
		if (!job_type_timeout){
			frappe.confirm(
				'Would you like to remove all current Print Wording entries and replace with defaults?',
				function(){
					set_job_type(frm, true);
				},
				function(){
					set_job_type(frm, false);
				}
			)
		}
		job_type_timeout = setTimeout(job_type_change, 1000); // This has been added to stop the confirm question being asked twice.
    },
	custom_add_standard_internal_colours_in: function(frm){
		if (frm.doc.custom_add_standard_internal_colours_in){
			frm.add_child('custom_internal_colours_included', {
				internal_colour_included: frm.doc.custom_add_standard_internal_colours_in
			});
			frm.doc.custom_add_standard_internal_colours_in = '';
			frm.refresh_field('custom_add_standard_internal_colours_in');
			frm.refresh_field('custom_internal_colours_included');
		}
	},
	custom_add_standard_external_colours_in: function(frm){
		if (frm.doc.custom_add_standard_external_colours_in){
			frm.add_child('custom_external_colours_included', {
				external_colour_included: frm.doc.custom_add_standard_external_colours_in
			});
			frm.doc.custom_add_standard_external_colours_in = '';
			frm.refresh_field('custom_add_standard_external_colours_in');
			frm.refresh_field('custom_external_colours_included');
		}
	},
	custom_add_standard_paints: function(frm){
		if (frm.doc.custom_add_standard_paints){
			frm.add_child('custom_paints_included', {
				paint: frm.doc.custom_add_standard_paints
			});
			frm.doc.custom_add_standard_paints = '';
			frm.refresh_field('custom_add_standard_paints');
			frm.refresh_field('custom_paints_included');
		}
	}	
});

function set_job_type(frm, clear_existing){
	// Get list of default entries from Job Type Defaults and add them to this quote
	if (clear_existing){
		frm.doc.quote_details_start = [];
		frm.refresh_field('custom_quote_details_start');
		frm.doc.works_included = [];
		frm.refresh_field('custom_works_included');
		frm.doc.paints_included = [];
		frm.refresh_field('custom_paints_included');
		frm.doc.internal_colours_included = [];
		frm.refresh_field('custom_internal_colours_included');
		frm.doc.external_colours_included = [];
		frm.refresh_field('custom_external_colours_included');
		frm.doc.quote_details_end = [];
		frm.refresh_field('custom_quote_details_end');
		frm.doc.final_notes = [];
		frm.refresh_field('custom_final_notes');
	}
	if (frm.doc.custom_job_type){
		frappe.db.get_doc('Job Types', frm.doc.custom_job_type)
			.then(r => {
				var myDefaults = r.defaults;
				(function loop_defaults(i){
					if (i == myDefaults.length) return; // jumps out of loop_defaults
					var mySection = myDefaults[i].section;
					var mySectionFieldName = "custom_" + mySection.toLowerCase().replaceAll(' ','_');
					if (mySection == 'Quote Details Start' ||  
						mySection == 'Quote Details End' || 
						mySection == 'Final Notes'){
						frappe.db.get_value(myDefaults[i].print_wording_type, myDefaults[i].default_entry, ['paragraph_name', 'paragraph_heading', 'paragraph_content'])
							.then(p => {
								let row = frm.add_child(mySectionFieldName, {
									paragraph_name: p.message.paragraph_name,
									heading: p.message.paragraph_heading,
									content: p.message.paragraph_content,
								});
								frm.refresh_field(mySectionFieldName);
								loop_defaults(i+1);
							})
					} else if (mySection == 'Works Included') {
						frappe.db.get_value(myDefaults[i].print_wording_type, myDefaults[i].default_entry, ['work_type', 'work_details'])
							.then(p => {
								let row = frm.add_child(mySectionFieldName, {
									work_type: p.message.work_type,
									work_details: p.message.work_details
								});
								frm.refresh_field(mySectionFieldName);
								loop_defaults(i+1);
						})
					} else if (mySection == 'Paints Included') {
						frappe.db.get_value(myDefaults[i].print_wording_type, myDefaults[i].default_entry, ['name'])
							.then(p => {
								let row = frm.add_child(mySectionFieldName, {
									paint: p.message.name
								});
								frm.refresh_field(mySectionFieldName);
								loop_defaults(i+1);
						})
					} else if (mySection == 'Internal Colours Included') {
						frappe.db.get_value(myDefaults[i].print_wording_type, myDefaults[i].default_entry, ['name'])
							.then(p => {
								let row = frm.add_child(mySectionFieldName, {
									internal_colour_included: p.message.name
								});
								frm.refresh_field(mySectionFieldName);
								loop_defaults(i+1);
						})
					} else if (mySection == 'External Colours Included') {
						frappe.db.get_value(myDefaults[i].print_wording_type, myDefaults[i].default_entry, ['name'])
							.then(p => {
								let row = frm.add_child(mySectionFieldName, {
									external_colour_included: p.message.name
								});
								frm.refresh_field(mySectionFieldName);
								loop_defaults(i+1);
						})
					}
				})(0);
			})
		}
}

function job_type_change(){
	job_type_timeout = null;
}