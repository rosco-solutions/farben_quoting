frappe.listview_settings['Farben Job Tracker'] = {
    refresh: function(listview) {
        // This targets the filter area specifically and hides the 'ID' (name) input
        listview.page.wrapper.find('.field-filter[data-fieldname="name"]').hide();
        
        // Also hide the "ID" from the primary search bar dropdown if it exists
        $('[data-fieldname="name"]').hide();
     
 
        listview.get_args = function () {  // Override only instance method
            let args = frappe.views.ListView.prototype.get_args.call(listview);  // Calling his super

            args.filters.some((f, i) => {
                if (f[1] === 'date_range') {  
                    // If date_range filter has been selected then determine the range selected and set ['Schedules', 'start', '<=', '<<datetime>>'] and ['Schedules', 'end', '>=', '<<datetime>>'] into the filter
                    // And remove the date_range search
                    var dateStart = new Date();
                    var dateEnd = new Date();
                    var val_start = '';
                    var val_end = '';
                    switch (f[3]) {
                        case 'day: yesterday':
                            dateStart.setDate(dateStart.getDate() - 1);
                            dateEnd.setDate(dateEnd.getDate() - 1);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2) 
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'day: today':
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'day: tomorrow':
                            dateStart.setDate(dateStart.getDate() + 1);
                            dateEnd.setDate(dateEnd.getDate() + 1);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'week: last x2':
                            dateStart.setDate(dateStart.getDate() - dateStart.getDay() - 14);
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay() - 7);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'week: last':
                            dateStart.setDate(dateStart.getDate() - dateStart.getDay() - 7);
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay());
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'week: this':
                            dateStart.setDate(dateStart.getDate() - dateStart.getDay());
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay() + 7);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'week: next':
                            dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 7);
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay() + 14);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'month: last':
                            dateStart = new Date(dateStart.getFullYear(), (dateStart.getMonth() - 1), 1);
                            dateEnd = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 0);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'month: this':
                            dateStart = new Date(dateStart.getFullYear(), dateStart.getMonth(), 1);
                            dateEnd = new Date(dateEnd.getFullYear(), (dateEnd.getMonth() + 1), 0);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'month: next':
                            dateStart = new Date(dateStart.getFullYear(), (dateStart.getMonth() + 1), 1);
                            dateEnd = new Date(dateEnd.getFullYear(), (dateEnd.getMonth() + 2), 0);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'year: last calendar':
                            dateStart = new Date((dateStart.getFullYear() - 1), 0, 1);
                            dateEnd = new Date((dateEnd.getFullYear() - 1), 11, 31);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'year: last financial':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date((dateStart.getFullYear() - 1), 6, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 5, 30);
                            } else {
                                dateStart = new Date((dateStart.getFullYear() - 2), 6, 1);
                                dateEnd = new Date((dateEnd.getFullYear() - 1), 5, 30);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'year: this calendar':
                            dateStart = new Date(dateStart.getFullYear(), 0, 1);
                            dateEnd = new Date(dateEnd.getFullYear(), 11, 31);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'year: this financial':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date(dateStart.getFullYear(), 6, 1);
                                dateEnd = new Date((dateEnd.getFullYear() + 1), 5, 30);
                            } else {
                                dateStart = new Date((dateStart.getFullYear() - 1), 6, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 5, 30);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: last (FY)':
                            if (dateStart.getMonth() > 8) {
                                dateStart = new Date(dateStart.getFullYear(), 6, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 9, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else if (dateStart.getMonth() > 5) {
                                dateStart = new Date(dateStart.getFullYear(), 3, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 6, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else if (dateStart.getMonth() > 2) {
                                dateStart = new Date(dateStart.getFullYear(), 0, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 3, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date((dateStart.getFullYear() - 1), 9, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 0, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: this (FY)':
                            if (dateStart.getMonth() > 8) {
                                dateStart = new Date(dateStart.getFullYear(), 9, 1);
                                dateEnd = new Date((dateEnd.getFullYear() + 1), 0, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else if (dateStart.getMonth() > 5) {
                                dateStart = new Date(dateStart.getFullYear(), 6, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 9, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else if (dateStart.getMonth() > 2) {
                                dateStart = new Date(dateStart.getFullYear(), 3, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 6, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date(dateStart.getFullYear(), 0, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 2, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: first (FY)':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date(dateStart.getFullYear(), 6, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 9, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date((dateStart.getFullYear() - 1), 6, 1);
                                dateEnd = new Date((dateEnd.getFullYear() - 1), 9, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: second (FY)':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date(dateStart.getFullYear(), 9, 1);
                                dateEnd = new Date((dateEnd.getFullYear() + 1), 0, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date((dateStart.getFullYear() - 1), 9, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 0, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: third (FY)':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date((dateStart.getFullYear() + 1), 0, 1);
                                dateEnd = new Date((dateEnd.getFullYear() + 1), 3, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date(dateStart.getFullYear(), 0, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 3, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'qtr: fourth (FY)':
                            if (dateStart.getMonth() > 5) {
                                dateStart = new Date((dateStart.getFullYear() + 1), 3, 1);
                                dateEnd = new Date((dateEnd.getFullYear() + 1), 6, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            } else {
                                dateStart = new Date(dateStart.getFullYear(), 3, 1);
                                dateEnd = new Date(dateEnd.getFullYear(), 6, 1);
                                dateEnd.setDate(dateEnd.getDate() - 1);
                            }
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'all: last week back':
                            dateStart = new Date('2007/01/01');
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay());
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'all: this week back':
                            dateStart = new Date('2007/01/01');
                            dateEnd.setDate(dateEnd.getDate() - dateEnd.getDay() + 7);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'all: from now on':
                            dateEnd = new Date(dateEnd.getFullYear(), (dateEnd.getMonth() + 36), 0);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                        case 'all: dates':
                            dateStart = new Date('2007/01/01');
                            dateEnd = new Date(dateEnd.getFullYear(), (dateEnd.getMonth() + 36), 0);
                            val_start = dateStart.getFullYear() + '/' + ('0' + (dateStart.getMonth() + 1)).slice(-2) + '/' + ('0' + dateStart.getDate()).slice(-2)
                            val_end = dateEnd.getFullYear() + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + ('0' + dateEnd.getDate()).slice(-2);
                            break;
                    }                    
                    var myfilters = args.filters;
                    args.filters = [];
					// val_end = val_end + ' 23:59:59';
					// val_start = val_start + ' 00:00:00';
                    for (var i=0; i<myfilters.length; i++){
                        if (myfilters[i][1] == 'date_range'){
                            args.filters.push(['Farben Job Tracker','date_worked', '<=', val_end]);
                            args.filters.push(['Farben Job Tracker','date_worked', '>=', val_start]);        
    
                        } else {
                            args.filters.push(myfilters[i]);
                        }
                    }
                }
            });

            return args;
        }
    },	 
}