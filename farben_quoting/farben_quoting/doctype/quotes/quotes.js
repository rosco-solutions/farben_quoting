// Copyright (c) 2021, Rosco Solutions and contributors
// For license information, please see license.txt

var mytimer;
var job_type_timeout;

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
	customer(frm){
		if (frm.doc.customer){
			frappe.db.get_value("Customers", {"name": frm.doc.customer}, ["address_line_1", "address_line_2", "csp", "phone", "email"], function(value) {
				frm.doc.address_line_1 = value.address_line_1;
				frm.doc.address_line_2 = value.address_line_2;
				frm.doc.csp = value.csp;
				frm.doc.phone = value.phone;
				frm.doc.email = value.email;
				// frm.doc.job_address_line_1 = value.address_line_1;
				// frm.doc.job_address_line_2 = value.address_line_2;
				// frm.doc.job_csp = value.csp;
				
				frm.refresh_field('address_line_1');
				frm.refresh_field('address_line_2');
				frm.refresh_field('csp');
				frm.refresh_field('phone');
				frm.refresh_field('email');
				// frm.refresh_field('job_address_line_1');
				// frm.refresh_field('job_address_line_2');
				// frm.refresh_field('job_csp');
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
	cost_1(frm){
		calc_costing(frm);
	},
	cost_2(frm){
		calc_costing(frm);
	},
	cost_3(frm){
		calc_costing(frm);
	},
	labour_gst(frm){
		calc_costing_gst(frm);
	},
	products_gst(frm){
		calc_costing_gst(frm);
	},
	cost_1_gst(frm){
		calc_costing_gst(frm);
	},
	cost_2_gst(frm){
		calc_costing_gst(frm);
	},
	cost_3_gst(frm){
		calc_costing_gst(frm);
	},
	add_standard_internal_colours_included(frm){
		if (frm.doc.add_standard_internal_colours_included){
			frm.add_child('internal_colours_included', {
				internal_colour_included: frm.doc.add_standard_internal_colours_included
			});
			frm.doc.add_standard_internal_colours_included = '';
			frm.refresh_field('add_standard_internal_colours_included');
			frm.refresh_field('internal_colours_included');
		}
	},
	add_standard_external_colours_included(frm){
		if (frm.doc.add_standard_external_colours_included){
			frm.add_child('external_colours_included', {
				external_colour_included: frm.doc.add_standard_external_colours_included
			});
			frm.doc.add_standard_external_colours_included = '';
			frm.refresh_field('add_standard_external_colours_included');
			frm.refresh_field('external_colours_included');
		}
	},
	add_standard_paints(frm){
		if (frm.doc.add_standard_paints){
			frm.add_child('paints_included', {
				paint: frm.doc.add_standard_paints
			});
			frm.doc.add_standard_paints = '';
			frm.refresh_field('add_standard_paints');
			frm.refresh_field('paints_included');
		}
	}
});

function calc_costing(myfrm){
	myfrm.doc.price = 	(myfrm.doc.labour?myfrm.doc.labour:0) + (myfrm.doc.products?myfrm.doc.products:0) + (myfrm.doc.cost_1?myfrm.doc.cost_1:0) + 
						(myfrm.doc.cost_2?myfrm.doc.cost_2:0) + (myfrm.doc.cost_3?myfrm.doc.cost_3:0);
	myfrm.refresh_field('price');
	myfrm.doc.gst = 0.1 * cint((myfrm.doc.labour_gst?myfrm.doc.labour_gst:0)) * (myfrm.doc.labour?myfrm.doc.labour:0) + 
					0.1 * cint((myfrm.doc.products_gst?myfrm.doc.products_gst:0)) * (myfrm.doc.products?myfrm.doc.products:0) + 
					0.1 * cint((myfrm.doc.cost_1_gst?myfrm.doc.cost_1_gst:0)) * (myfrm.doc.cost_1?myfrm.doc.cost_1:0) + 
					0.1 * cint((myfrm.doc.cost_2_gst?myfrm.doc.cost_2_gst:0)) * (myfrm.doc.cost_2?myfrm.doc.cost_2:0) +
					0.1 * cint((myfrm.doc.cost_3_gst?myfrm.doc.cost_3_gst:0)) * (myfrm.doc.cost_3?myfrm.doc.cost_3:0);
	myfrm.refresh_field('gst');
	myfrm.doc.total_price = myfrm.doc.price + myfrm.doc.gst;
	myfrm.refresh_field('total_price');
}

function calc_costing_gst(myfrm){
	myfrm.doc.gst = 0.1 * cint((myfrm.doc.labour_gst?myfrm.doc.labour_gst:0)) * (myfrm.doc.labour?myfrm.doc.labour:0) + 
					0.1 * cint((myfrm.doc.products_gst?myfrm.doc.products_gst:0)) * (myfrm.doc.products?myfrm.doc.products:0) + 
					0.1 * cint((myfrm.doc.cost_1_gst?myfrm.doc.cost_1_gst:0)) * (myfrm.doc.cost_1?myfrm.doc.cost_1:0) + 
					0.1 * cint((myfrm.doc.cost_2_gst?myfrm.doc.cost_2_gst:0)) * (myfrm.doc.cost_2?myfrm.doc.cost_2:0) +
					0.1 * cint((myfrm.doc.cost_3_gst?myfrm.doc.cost_3_gst:0)) * (myfrm.doc.cost_3?myfrm.doc.cost_3:0);
	myfrm.refresh_field('gst');
	myfrm.doc.total_price = myfrm.doc.price + myfrm.doc.gst;
	myfrm.refresh_field('total_price');
}

function clear_address_fields(myfrm){
	myfrm.doc.address_line_1 = '';
	myfrm.doc.address_line_2 = '';
	myfrm.doc.csp = '';
	myfrm.doc.phone = '';
	myfrm.doc.email = '';
	// myfrm.doc.job_address_line_1 = '';
	// myfrm.doc.job_address_line_2 = '';
	// myfrm.doc.job_csp = '';
	myfrm.refresh_field('address_line_1');
	myfrm.refresh_field('address_line_2');
	myfrm.refresh_field('csp');
	myfrm.refresh_field('phone');
	myfrm.refresh_field('email');
	// myfrm.refresh_field('job_address_line_1');
	// myfrm.refresh_field('job_address_line_2');
	// myfrm.refresh_field('job_csp');
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

// frappe.ui.form.on('Quote Paints', {
// 	onload: function(frm){		
// 		frm.set_query('paint', 'quote_paints', function(){
// 			return {
// 				filters: {
// 					'hide': '0'
// 				}
// 			}
// 		});
// 	},
// });

function set_job_type(frm, clear_existing){
	// Get list of default entries from Job Type Defaults and add them to this quote
	if (clear_existing){
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
	}
	if (frm.doc.job_type){
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
		}
}

function job_type_change(){
	job_type_timeout = null;
}