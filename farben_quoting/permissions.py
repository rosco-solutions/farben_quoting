# In your_custom_app/permissions.py
import frappe

def get_communication_permissions(user=None):
    """
    1. Administrator sees everything.
    2. Standard users see emails where their email address matches the sender or recipient fields.
    3. Standard users see emails linked to any DocType they have Read access to.
    """
    if not user:
        user = frappe.session.user

    # Root admin bypasses all restrictions
    if user == "Administrator":
        return ""

    conditions = []

    # Get the logged-in user's actual email address string
    user_email = frappe.db.get_value("User", user, "email")
    
    if user_email:
        # Securely escape the user's email for the raw SQL string
        escaped_email = frappe.db.escape(user_email)
        
        # Check if the user sent it, or if their email is in the recipient/cc lists
        conditions.append(f"`tabCommunication`.sender = {escaped_email}")
        conditions.append(f"`tabCommunication`.recipients LIKE concat('%', {escaped_email}, '%')")
        conditions.append(f"`tabCommunication`.cc LIKE concat('%', {escaped_email}, '%')")

    # Always allow users to see standard timeline Comments
    conditions.append("`tabCommunication`.communication_type = 'Comment'")

    # Dynamic check: Find DocTypes the user has explicit permission to read (Projects, Customers, etc.)
    readable_doctypes = []
    all_doctypes = frappe.get_all("DocType", filters={"istable": 0}, pluck="name")
    
    for dt in all_doctypes:
        if frappe.has_permission(dt, "read", user=user):
            readable_doctypes.append(frappe.db.escape(dt))

    if readable_doctypes:
        doctype_list = ", ".join(readable_doctypes)
        conditions.append(f"`tabCommunication`.reference_doctype IN ({doctype_list})")

    # Combine all rules with OR
    return f"({' OR '.join(conditions)})"
