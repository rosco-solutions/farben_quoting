// Copyright (c) 2021, Rosco Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customers', {
	company(frm){
		if (frm.doc.company){
			frappe.db.get_value("Companies", {"name": frm.doc.company}, ["address_line_1", "address_line_2", "csp", "phone", "email"], function(value) {
				frm.doc.address_line_1 = value.address_line_1;
				frm.doc.address_line_2 = value.address_line_2;
				frm.doc.csp = value.csp;
				frm.doc.phone = value.phone;
				frm.doc.email = value.email;
				frm.refresh_field('address_line_1');
				frm.refresh_field('address_line_2');
				frm.refresh_field('csp');
				frm.refresh_field('phone');
				frm.refresh_field('email');
			});
		} else {
			if (mytimer) clearTimeout(mytimer);
			mytimer = setTimeout(clear_address_fields,50,frm);
		}
	}
});

function clear_address_fields(myfrm){
	myfrm.doc.address_line_1 = '';
	myfrm.doc.address_line_2 = '';
	myfrm.doc.csp = '';
	myfrm.doc.phone = '';
	myfrm.doc.email = '';
	myfrm.refresh_field('address_line_1');
	myfrm.refresh_field('address_line_2');
	myfrm.refresh_field('csp');
	myfrm.refresh_field('phone');
	myfrm.refresh_field('email');
}
