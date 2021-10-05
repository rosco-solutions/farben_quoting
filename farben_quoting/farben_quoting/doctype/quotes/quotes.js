// Copyright (c) 2021, Rosco Solutions and contributors
// For license information, please see license.txt

var mytimer;
frappe.ui.form.on('Quotes', {
	onload(frm) {
		frm.set_query('customer', function(){
			return {
				'filters': {
					'company': frm.doc.company
				}
			}
		});
	},
	job_type(frm){
		frappe.confirm(
			'Would you like to remove all current Print Wording entries and replace with defaults?',
			function(){
				// Get list of default entries from Job Type Defaults and add them to this quote
				frm.doc.quote_details_start = [];
				frm.refresh_field('quote_details_start');
				frm.doc.works_included = [];
				frm.refresh_field('works_included');
				frm.doc.paints_included = [];
				frm.refresh_field('paints_included');
				frm.doc.internal_colours_included = [];
				frm.refresh_field('internal_colours_included');
				frm.doc.external_colours_included = [];
				frm.refresh_field('external_colours_included');
				frm.doc.quote_details_end = [];
				frm.refresh_field('quote_details_end');
				frm.doc.final_notes = [];
				frm.refresh_field('final_notes');
				frappe.db.get_doc('Job Types', frm.doc.job_type)
					.then(r => {
						var myDefaults = r.defaults;
						(function loop_defaults(i){
							if (i == myDefaults.length) return; // jumps out of loop_defaults
							var mySection = myDefaults[i].section;
							var mySectionFieldName = mySection.toLowerCase().replaceAll(' ','_');
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
			}//,
			// function(){
				// msgprint('you selected no');
			// }
		)
	},
	customer(frm){
		if (frm.doc.customer){
			frappe.db.get_value("Customers", {"name": frm.doc.customer}, ["address_line_1", "address_line_2", "csp", "phone", "email"], function(value) {
				frm.doc.address_line_1 = value.address_line_1;
				frm.doc.address_line_2 = value.address_line_2;
				frm.doc.csp = value.csp;
				frm.doc.phone = value.phone;
				frm.doc.job_address_line_1 = value.address_line_1;
				frm.doc.job_address_line_2 = value.address_line_2;
				frm.doc.job_csp = value.csp;
				frm.doc.email = value.email;
				frm.refresh_field('address_line_1');
				frm.refresh_field('address_line_2');
				frm.refresh_field('csp');
				frm.refresh_field('phone');
				frm.refresh_field('job_address_line_1');
				frm.refresh_field('job_address_line_2');
				frm.refresh_field('job_csp');
				frm.refresh_field('email');
			});
		} else {
			if (mytimer) clearTimeout(mytimer);
			mytimer = setTimeout(clear_address_fields,50,frm);
		}
	},
	company(frm){
        frm.set_value('customer', '')
            .then(function(){
                frm.set_query('customer', function(){
                    return {
                        'filters': {
                            'company': frm.doc.company
                        }
                    }
                })
            });
    },
	labour(frm){
		calc_costing(frm);
	},
	products(frm){
		calc_costing(frm);
	},
	equipment(frm){
		calc_costing(frm);
	},
	scaffolding(frm){
		calc_costing(frm);
	},
	labour_gst(frm){
		calc_costing_gst(frm);
	},
	products_gst(frm){
		calc_costing_gst(frm);
	},
	equipment_gst(frm){
		calc_costing_gst(frm);
	},
	scaffolding_gst(frm){
		calc_costing_gst(frm);
	},
});

function calc_costing(myfrm){
	myfrm.doc.price = myfrm.doc.labour + myfrm.doc.products + myfrm.doc.equipment + myfrm.doc.scaffolding;
	myfrm.refresh_field('price');
	myfrm.doc.gst = 0.1 * cint(myfrm.doc.labour_gst) * myfrm.doc.labour + 0.1 * cint(myfrm.doc.products_gst) * myfrm.doc.products + 
					0.1 * cint(myfrm.doc.equipment_gst) * myfrm.doc.equipment + 0.1 * cint(myfrm.doc.scaffolding_gst) * myfrm.doc.scaffolding;
	myfrm.refresh_field('gst');
	myfrm.doc.total_price = myfrm.doc.price + myfrm.doc.gst;
	myfrm.refresh_field('total_price');
}

function calc_costing_gst(myfrm){
	myfrm.doc.gst = 0.1 * cint(myfrm.doc.labour_gst) * myfrm.doc.labour + 0.1 * cint(myfrm.doc.products_gst) * myfrm.doc.products + 
					0.1 * cint(myfrm.doc.equipment_gst) * myfrm.doc.equipment + 0.1 * cint(myfrm.doc.scaffolding_gst) * myfrm.doc.scaffolding;
	myfrm.refresh_field('gst');
	myfrm.doc.total_price = myfrm.doc.price + myfrm.doc.gst;
	myfrm.refresh_field('total_price');
}

function clear_address_fields(myfrm){
	myfrm.doc.address_line_1 = '';
	myfrm.doc.address_line_2 = '';
	myfrm.doc.csp = '';
	myfrm.doc.phone = '';
	myfrm.doc.job_address_line_1 = '';
	myfrm.doc.job_address_line_2 = '';
	myfrm.doc.job_csp = '';
	myfrm.doc.email = '';
	myfrm.refresh_field('address_line_1');
	myfrm.refresh_field('address_line_2');
	myfrm.refresh_field('csp');
	myfrm.refresh_field('phone');
	myfrm.refresh_field('job_address_line_1');
	myfrm.refresh_field('job_address_line_2');
	myfrm.refresh_field('job_csp');
	myfrm.refresh_field('email');
}

frappe.ui.form.on('Quote Details', {
	paragraph_name(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		if (child.paragraph_name) {
			frappe.db.get_value("Standard Paragraphs", {"paragraph_name": child.paragraph_name}, ["paragraph_heading", "paragraph_content"], function(value) {
				child.heading = value.paragraph_heading;
				child.content = value.paragraph_content;
				frm.refresh_field('quote_details_start');
				frm.refresh_field('quote_details_end');
				frm.refresh_field('final_notes');
			});
		};
	}
});

frappe.ui.form.on('Quote Works Included', {
	work_type(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		if (child.work_type) {
			frappe.db.get_value("Works Included", {"work_type": child.work_type}, "work_details", function(value) {
				child.work_details = value.work_details;
				frm.refresh_field('works_included');
			});
		};
	}
});