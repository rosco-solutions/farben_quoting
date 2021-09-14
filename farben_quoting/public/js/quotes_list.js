frappe.listview_settings['Quotes'] = {
    onload: function (listview) {
        var df = {
            fieldname: "detail_type",
            label:"Detail Type",
            fieldtype: "Link",
            options: "Quote Detail Templates",
            onchange: function(){
                listview.start = 0;
                listview.refresh();
                listview.on_filter_change();
            },
        }
        listview.page.add_field(df);
    }
};