# In your_custom_app/permissions.py
import frappe

def get_communication_permissions(user=None):
    """
    1. Administrator and System Managers see everything.
    2. Standard users see emails where their email address matches the sender or recipient fields.
    3. Standard users see emails linked to any DocType they have Read access to.
    """
    if not user:
        user = frappe.session.user

    # Root admin bypasses all restrictions
    if user == "Administrator" or "System Manager" in frappe.get_roles(user):
        return ""

    conditions = []

    # Get the logged-in user's actual email address string
    user_email = frappe.db.get_value("User", user, "email")
    
    if user_email:
        # Securely escape the user's email for the raw SQL string
        escaped_email = frappe.db.escape(user_email)
        
        # FIXED: Doubled the '%' to '%%' so MariaDB doesn't mistake it for a Python format string argument
        conditions.append(f"`tabCommunication`.sender = {escaped_email}")
        conditions.append(f"`tabCommunication`.recipients LIKE concat('%%', {escaped_email}, '%%')")
        conditions.append(f"`tabCommunication`.cc LIKE concat('%%', {escaped_email}, '%%')")

    # Always allow users to see standard timeline Comments
    conditions.append("`tabCommunication`.communication_type = 'Comment'")

    # Dynamic check: Find DocTypes the user has explicit permission to read (Projects, Customers, etc.)
    readable_doctypes = []
    all_doctypes = frappe.get_all("DocType", filters={"istable": 0}, pluck="name")
    
    # Explicitly skip core system configurations to save execution time and prevent framework crashes
    ignored_doctypes = ["System Health Report", "DocType", "User", "Role", "DocPerm", "Has Role"]

    for dt in all_doctypes:
        if dt in ignored_doctypes:
            continue
            
        try:
            # Safely check permission permissions without letting internal exceptions crash the loop
            if frappe.has_permission(dt, "read", user=user):
                readable_doctypes.append(frappe.db.escape(dt))
        except (frappe.PermissionError, Exception):
            # Gracefully catch administrative locks raised inside individual core DocType controllers
            continue

    if readable_doctypes:
        doctype_list = ", ".join(readable_doctypes)
        conditions.append(f"`tabCommunication`.reference_doctype IN ({doctype_list})")

    # Combine all rules with OR
    if conditions:
        return f"({' OR '.join(conditions)})"
        
    return "1=0" # Fallback security clause if no conditions evaluate