import frappe
from frappe.utils import time_diff_in_hours, add_to_date, get_datetime, time_diff_in_seconds

# Custom Timesheet Methods to include lunch deduction logic. These override the standard methods 
# found in erpnext.projects.doctype.timesheet.timesheet

def custom_calculate_hours(self):
    """Replaces the standard Timesheet.calculate_hours method"""
    for row in self.time_logs:
        if row.to_time and row.from_time:
            # Standard duration
            duration = time_diff_in_hours(row.to_time, row.from_time)
            
            # Apply your custom lunch deduction logic
            if getattr(row, "custom_lunch_included", None):
                row.hours = max(0, duration - 0.5)
            else:
                row.hours = duration

def custom_set_to_time(self, data):
    """
    Overrides set_to_time to account for lunch deduction.
    If lunch is included, we add 0.5 hours back to the 'hours' 
    provided to calculate the correct 'to_time'.
    """
    if not (data.from_time and data.hours):
        return

    # Calculate actual hours to add (Gross hours)
    hours_to_add = data.hours
    if getattr(data, "custom_lunch_included", None):
        hours_to_add = data.hours + 0.5

    # Calculate the new to_time
    _to_time = get_datetime(add_to_date(data.from_time, hours=hours_to_add, as_datetime=True))

    # Update only if the difference is significant (>= 1 second)
    if not data.to_time or abs(time_diff_in_seconds(_to_time, data.to_time)) >= 1:
        data.to_time = _to_time
        
def manage_email_account_permissions(doc, method=None):
    """
    Automates the User Permission generation for Email Accounts.
    If 'Make Private' is ticked, it creates a specific User Permission for the owner.
    If unticked, it removes the restriction.
    """
    # 1. Fallback to check who 'owns' this account. 
    # Usually this is the 'email_id' if your users log in with their email addresses.
    owner_user = doc.email_id or doc.owner

    # Check if this user actually exists in Frappe to prevent errors
    if not frappe.db.exists("User", owner_user):
        return

    # Check for an existing User Permission for this exact mapping
    existing_permission = frappe.db.get_value(
        "User Permission",
        {
            "user": owner_user,
            "allow": "Email Account",
            "for_value": doc.name,
            "applicable_for": "Email Account"
        }
    )

    if doc.custom_make_private:
        # If checked and permission doesn't exist, create it
        if not existing_permission:
            p_doc = frappe.new_doc("User Permission")
            p_doc.user = owner_user
            p_doc.allow = "Email Account"
            p_doc.for_value = doc.name
            p_doc.apply_to_all_doctypes = 0
            p_doc.applicable_for = "Email Account"
            p_doc.insert(ignore_permissions=True)
    else:
        # If unchecked and a permission exists, clean it up
        if existing_permission:
            frappe.delete_doc("User Permission", existing_permission, ignore_permissions=True)


def filter_private_communications(user=None):
    """
    Dynamically filters the Communication query.
    Hides communications belonging to private email accounts unless the logged-in user owns them.
    """
    if not user:
        user = frappe.session.user

    # # Administrators / System Managers typically bypass restrictions globally
    # if user == "Administrator" or "System Manager" in frappe.get_roles(user):
    #     return ""

    # 1. Find all Email Accounts that are marked as private
    private_accounts = frappe.get_all(
        "Email Account", 
        filters={"custom_make_private": 1}, 
        fields=["name", "email_id"]
    )
    
    if not private_accounts:
        return ""

    # 2. Separate accounts the current user is allowed to see vs. what they should be blocked from
    blocked_accounts = []
    for account in private_accounts:
        # The user is allowed to see it if they are the designated owner of that private account
        if account.email_id != user:
            blocked_accounts.append(account.name)

    # 3. If there are private accounts this user doesn't own, generate the clean SQL block condition
    if blocked_accounts:
        # FIXED: Removed frappe.db.escape to prevent double-escaping compilation breaks
        formatted_list = ", ".join([f"'{acc}'" for acc in blocked_accounts])
        return f"(ifnull(email_account, '') NOT IN ({formatted_list}))"

    return ""