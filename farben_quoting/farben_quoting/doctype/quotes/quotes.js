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
    }
});

frappe.ui.form.on('Quote Details', {
	paragraph_name(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		frappe.db.get_value("Standard Paragraphs", {"paragraph_name": child.paragraph_name}, "paragraph_content", function(value) {
            child.content = value.paragraph_content;
			frm.refresh_field('quote_details_start');
			frm.refresh_field('quote_details_end');
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