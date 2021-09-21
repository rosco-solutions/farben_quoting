// Copyright (c) 2021, Rosco Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on('Quotes', {
	onload(frm) {
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
	customer(frm){
		frappe.db.get_value("Customers", {"name": frm.doc.customer}, ["address_line_1", "address_line_2", "csp", "phone"], function(value) {
            frm.doc.address_line_1 = value.address_line_1;
			frm.doc.address_line_2 = value.address_line_2;
			frm.doc.csp = value.csp;
			frm.doc.phone = value.phone;
            frm.doc.job_address_line_1 = value.address_line_1;
			frm.doc.job_address_line_2 = value.address_line_2;
			frm.doc.job_csp = value.csp;
			frm.refresh_field('address_line_1');
			frm.refresh_field('address_line_2');
			frm.refresh_field('csp');
			frm.refresh_field('phone');
			frm.refresh_field('job_address_line_1');
			frm.refresh_field('job_address_line_2');
			frm.refresh_field('job_csp');
			
        });
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
		// frm.doc.price = frm.doc.labour + frm.doc.products + frm.doc.equipment + frm.doc.scaffolding;
		// frm.refresh_field('price');
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	products(frm){
		calc_costing(frm);
		// frm.doc.price = frm.doc.labour + frm.doc.products + frm.doc.equipment + frm.doc.scaffolding;
		// frm.refresh_field('price');
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	equipment(frm){
		calc_costing(frm);
		// frm.doc.price = frm.doc.labour + frm.doc.products + frm.doc.equipment + frm.doc.scaffolding;
		// frm.refresh_field('price');
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	scaffolding(frm){
		calc_costing(frm);
		// frm.doc.price = frm.doc.labour + frm.doc.products + frm.doc.equipment + frm.doc.scaffolding;
		// frm.refresh_field('price');
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	labour_gst(frm){
		calc_costing_gst(frm);
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	products_gst(frm){
		calc_costing_gst(frm);
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	equipment_gst(frm){
		calc_costing_gst(frm);
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
	},
	scaffolding_gst(frm){
		calc_costing_gst(frm);
		// frm.doc.gst = 0.1 * cint(frm.doc.labour_gst) * frm.doc.labour + 0.1 * cint(frm.doc.products_gst) * frm.doc.products + 
		// 				0.1 * cint(frm.doc.equipment_gst) * frm.doc.equipment + 0.1 * cint(frm.doc.scaffolding_gst) * frm.doc.scaffolding;
		// frm.refresh_field('gst');
		// frm.doc.total_price = frm.doc.price + frm.doc.gst;
		// frm.refresh_field('total_price');
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

frappe.ui.form.on('Quote Details', {
	paragraph_name(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		frappe.db.get_value("Standard Paragraphs", {"paragraph_name": child.paragraph_name}, ["paragraph_heading", "paragraph_content"], function(value) {
            child.heading = value.paragraph_heading;
			child.content = value.paragraph_content;
			frm.refresh_field('quote_details_start');
			frm.refresh_field('quote_details_end');
			frm.refresh_field('final_notes');
        });
	}
});

frappe.ui.form.on('Quote Works Included', {
	work_type(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		frappe.db.get_value("Works Included", {"work_type": child.work_type}, "work_details", function(value) {
            child.work_details = value.work_details;
			frm.refresh_field('works_included');
        });
	}
});